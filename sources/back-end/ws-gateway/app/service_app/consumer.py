
import datetime
import asyncio
import json
import sys

from aio_pika import IncomingMessage as aio_pika_IncomingMessage
from channels.generic.websocket import AsyncWebsocketConsumer
from service_app.rabbitmq import RabbitmqManager
from service_app.utils import Message, UserStatus
from asgiref.sync import sync_to_async
from django.conf import settings

# **************************************************************************** #
#   * AsyncChatConsumer Class :                                                #
# **************************************************************************** #
class AsyncChatConsumer(AsyncWebsocketConsumer):
    """
    Handles WebSocket connections for chat functionality.
    """

    #=== init : ================================================================
    def __init__(self, *args: object, **kwargs: object) -> None:
        """
        Initializes the consumer with a RabbitMQ handler.
        """
        super().__init__(*args, **kwargs)
        self.message_queue = RabbitmqManager()


    #=== connect : =============================================================
    async def connect(self) -> None:
        """
        Handles the connection event with exception handling.
        """
        try:
            headers = dict(self.scope['headers'])
            x_user_id = headers.get(b'x-user-id', None)

            if x_user_id is None:
                await self.close()

            self.user_id       = x_user_id.decode('utf-8')
            self.group_name    = f"user_{self.user_id}"
            self.timeout_task  = None

            await self.message_queue.connect()
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.channel_layer.group_add("all_users", self.channel_name)
            await self.accept()

            self.timeout_task = asyncio.create_task(
                self.disconnect_after(settings.CHANNEL_TIMEOUT)
            )

            await self.publish_user_status(UserStatus.CONNECTED)
            await self.message_queue.consume(
                queue_name      = str(settings.SERVER_HOST),
                exchange_name   = "--new-message",
                on_message      = self.on_message
            )

        except Exception as error:
            print(f"Connection Error: {error}", file=sys.stderr)
            await self.close()


    #=== disconnect : ==========================================================
    async def disconnect(self, close_code: int) -> None:
        """
        Handles the disconnection event.
        """
        self.timeout_task.cancel() if self.timeout_task else None
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_discard("all_users", self.channel_name)
        await self.publish_user_status(UserStatus.DISCONNECTED)
        await self.message_queue.close_channels()
        self.message_queue = None


    #=== disconnect_after_delay : =============================================
    async def disconnect_after(self, delay: float) -> None:
        """
        Closes the connection after a specified delay in seconds.
        """
        await asyncio.sleep(delay)
        print(f"Connection timeout: user_id=[{self.user_id}]")
        await self.close()


    #=== receive : =============================================================
    async def receive(self,
                      text_data: str= None,
                      bytes_data: bytes= None
        ) -> None:
        """
        Handles incoming WebSocket messages.
        """
        try:
            new_message = await sync_to_async(Message)(text_data)
            new_message.user_from = str(self.user_id)
            new_message.timestamp = int(datetime.datetime.now().timestamp() * 1000)
            await self.message_queue.publish_message(**new_message.post())

        except Exception as e:
            print(f"Error processing message: {e}", file=sys.stderr)
            await self.send(f'{{"error": "{e}"}}')


    #=== publish_user_status : =================================================
    async def publish_user_status(self, user_status: UserStatus) -> None:
        """
        Publishes user status .
        """
        message = json.dumps({
            "user_id"      : str(self.user_id),
            "status"       : user_status.value,
            "server_name"  : str(settings.SERVER_HOST),
            "channel_name" : self.channel_name
        })

        await self.message_queue.publish_message(
            message         = message.encode(),
            exchange_name   = "--user-status",
        )


    #=== on_message : ==========================================================
    async def on_message(self,
                         incoming_message: aio_pika_IncomingMessage
        ) -> None:
        """
        Handles incoming messages from RabbitMQ.
        """
        try:
            async with incoming_message.process():
                message_data = json.loads(incoming_message.body.decode())
                if message_data.get("type") == "user_status":
                    await self.channel_layer.group_send(
                        "all_users",
                        {
                            "type"    : "send_message",
                            "message" : message_data,
                        }
                    )

                else :
                    await self.channel_layer.group_send(
                        f"user_{message_data['recipient_id']}",
                        {
                            "type"    : "send_message",
                            "message" : message_data,
                        }
                    )

        except Exception as e:
            print(f"Error processing RabbitMQ message: {e}", file=sys.stderr)


    #=== send_message : ========================================================
    async def send_message(self, event: dict) -> None:
        """
        Sends a message to the WebSocket.
        """
        try:
            message_data = event["message"]
            message_text = json.dumps(message_data)
            await self.send(message_text)

        except Exception as error:
            print(f"Error sending message: {error}", file=sys.stderr)
