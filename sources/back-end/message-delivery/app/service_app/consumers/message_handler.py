
import orjson
import sys

from aio_pika import IncomingMessage as aio_pika_IncomingMessage
from service_app.components.Message import Message, MessageSerializer
from typing import Dict

#=== listen queue : ============================================================
CONSUMING_QUEUE = "messages"
EXCHANGE = "--new-message"


#=== message process  : ========================================================
async def callback(pika_message: aio_pika_IncomingMessage) -> None:
    """
    Process incoming message from RabbitMQ queue.
    """
    try:
        message: Dict = orjson.loads(pika_message.body)
        message_type = message.get("type")

        if message_type == "chat":
            await save_message(message)
            # send sent ack to from user
            # if not connect send a notification to email

        elif message_type == "ack":
            await update_acknowledge(message)


    except Exception as e:
        print(f"Processing message error: {e}", file=sys.stderr)


#===  update_acknowledge: =====================================================
async def update_acknowledge(message_data: Dict[str, str]) -> None:
    """
    Acknowledge a message.
    """
    message_from_db = await Message.objects.aget(
         sender_id=message_data["recipient_id"],
         tracking_no=message_data["tracking_no"],
    )

    current_status = message_from_db.status
    new_status = Message.Status(message_data["status"])

    if current_status == Message.Status.READ or\
       new_status == current_status:
         return

    if current_status == Message.Status.DELIVERED and\
       new_status == Message.Status.SENT:
         return

    message_from_db.status = new_status
    await message_from_db.asave()


#=== save_message: =============================================================
async def save_message(message: Dict) -> None:
    """
    Saves the message to the database.
    """
    serializer  = MessageSerializer(data=message)
    serializer.is_valid(raise_exception=True)
    await serializer.acreate(serializer.validated_data)
