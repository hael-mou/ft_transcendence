
import asyncio
import aiormq
import os

from aio_pika import IncomingMessage as aio_pika_IncomingMessage
from service_app.utils.rabbitmq import RabbitmqManager
from django.core.management.base import BaseCommand
from importlib import import_module
from sys import exit as sys_exit
from pathlib import Path

# **************************************************************************** #
#   * Command Class :  run rabbitmq consummer                                  #
# **************************************************************************** #
class Command(BaseCommand):
    help        = "Runs a RabbitMQ consumer using the specified module"
    app_dir     = Path(__file__).resolve().parent.parent.parent
    app_name    = os.path.basename(app_dir)


    #=== add_argument: =========================================================
    def add_arguments(self, parser):
        """
        Add arguments to the command line
        """
        parser.add_argument(
            "module_name",
            type=str,
            help="The name of the consumer module (without .py)"
        )


    #=== handle: ===============================================================
    def handle(self, *args, **options):
        """
        Run a RabbitMQ consumer using the specified module
        """
        self.name = options['module_name']
        module_name = f"{self.app_name}.consumers.{self.name}"

        try:
            consumer_module = import_module(module_name)

            self.callback = consumer_module.callback
            asyncio.run(self._consume(consumer_module))

        except KeyboardInterrupt:
            self.stdout.write("Consumer Exiting....")
            sys_exit(0)

        except Exception as e:
            self.stderr.write(f"Error: while setup consumer: {e}")
            sys_exit(1)


    #=== _consume: =============================================================
    async def _consume(self, consumer_module):
        """
        Consumes messages from the specified queue.
        """
        message_queue = RabbitmqManager()

        while True:
            try:
                await message_queue.connect()
                await message_queue.consume(
                    queue_name      = consumer_module.CONSUMING_QUEUE,
                    exchange_name   = consumer_module.EXCHANGE,
                    on_message      = self.on_message
                )
                self.stdout.write(f"{self.name} consumer started...")
                await asyncio.Future()

            except aiormq.exceptions.AMQPConnectionError:
                self.stdout.write(f"Restarting {self.name} consumer...")
                await asyncio.sleep(5)

            finally:
                await message_queue.close_connection()



    #=== on_message: ===========================================================
    async def on_message(self, message: aio_pika_IncomingMessage):
        """
        Process incoming message from RabbitMQ queue.
        """
        async with message.process():
            print(f"{self.name} Received message, processing...")
            await self.callback(message)
