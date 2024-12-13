
import aio_pika
import asyncio

from django.conf import settings
from typing import Callable

# **************************************************************************** #
#   * RabbitmqManager class:                                                   #
# **************************************************************************** #
class RabbitmqManager:
    """
    Handles connections to RabbitMQ.
    """

    #=== class var : ===========================================================
    _connection = None


    #=== init : ================================================================
    def __init__(self) -> None:
        """
        Initializes the RabbitMQ connection handler.
        """
        self.consumers = []
        self.channel = None


    #=== Connect : =============================================================
    @classmethod
    async def connect(cls) -> None:
        """
        Establishes a connection to RabbitMQ and opens a channel.
        """
        if cls._connection is not None:
            return

        async with asyncio.Lock():
            cls._connection = await aio_pika.connect_robust(
                host     = settings.RABBITMQ_HOST,
                port     = int(settings.RABBITMQ_PORT),
                login    = settings.RABBITMQ_USER,
                password = settings.RABBITMQ_PASSWORD,
            )


    #=== close_connection : ====================================================
    @classmethod
    async def close_connection(cls) -> None:
        """
        Closes the RabbitMQ connection if it exists.
        """
        if cls._connection is None:
            return

        await cls._connection.close()
        cls._connection = None


    #=== close_channels : ======================================================
    async def close_channels(self) -> None:
        """
        Closes the RabbitMQ channels and stop all consumers.
        """

        if self.channel is not None:
            await self.channel.close()

        for consumer in self.consumers:
            await consumer["channel"].close()
        self.consumers.clear()


    #=== publish : =============================================================
    async def publish_message(self,
                              message: bytes,
                              queue_name: str = "",
                              exchange_name: str = ""
        ) -> None:
        """
        Publishes the message to the specified queue/exchange.
        """
        try:
            await self._connection.connect()

            if self.channel is None:
                self.channel = await self._connection.channel()
            if queue_name != "":
                await self.channel.declare_queue(queue_name, durable=True)

            exchange = await self.channel.declare_exchange(
                exchange_name,
                aio_pika.ExchangeType.FANOUT,
                durable=True
            ) if exchange_name != "" else self.channel.default_exchange

            await exchange.publish(
                aio_pika.Message(body=message),
                routing_key=queue_name
            )

        except Exception as error:
            print(f"RabbitMQ publish error: {error}")


    #=== consume : =============================================================
    async def consume(self,
                      queue_name: str,
                      exchange_name: str,
                      on_message: Callable[[aio_pika.IncomingMessage], None]
        ) -> None:
        """
        Consumes messages from the specified queue and processes
        them with the provided function.
        """
        await self._connection.connect()
        channel = await self._connection.channel()
        await channel.set_qos(prefetch_count=10)

        exchange = await channel.declare_exchange(
            exchange_name,
            aio_pika.ExchangeType.FANOUT,
            durable=True
        )

        queue = await channel.declare_queue(queue_name, durable=True)
        await queue.bind(exchange)

        consumer_tag = await queue.consume(on_message)
        self.consumers.append({
            "channel": channel,
            "queue": queue,
            "consumer_tag": consumer_tag,
        })
