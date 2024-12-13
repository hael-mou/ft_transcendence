
import orjson
import sys

from aio_pika import IncomingMessage as aio_pika_IncomingMessage
from service_app.components.Connection import Connection
from service_app.utils.rabbitmq import RabbitmqManager
from typing import Dict

#=== listen queue : ============================================================
CONSUMING_QUEUE = "user_status_ms"
EXCHANGE = "--user-status"

PUBLISH_EXCHANGE = "--new-message"

#=== message process  : ========================================================
async def callback(message: aio_pika_IncomingMessage) -> None:
    """
    Process an incoming user status message from RabbitMQ queue.
    """
    try:
        connection_info: Dict[str, str] = orjson.loads(message.body)

        if connection_info["status"] == "connected":
            await register_new_connect(connection_info)

        else:
            await unregister_connect_if_exist(connection_info)

    except Exception as e:
        print(f"processing message Error: `{e}'", file=sys.stderr)


#=== register_new_connect  : ===================================================
async def register_new_connect(user_status: Dict[str, str]) -> None:
    connection = Connection(
        user_id=user_status["user_id"],
        server_name=user_status["server_name"],
        channel_name=user_status["channel_name"],
    )
    await connection.asave()

    await RabbitmqManager().publish_message(
        message=orjson.dumps(
            {
                "type"    : "user_status",
                "user_id" : user_status["user_id"],
                "status"  : "connected",
            }
        ),
        exchange_name=PUBLISH_EXCHANGE,
    )



#=== unregister_connect_if_exist  : ============================================
async def unregister_connect_if_exist(user_status: Dict[str, str]) -> None:
    try:
        connections = await Connection.objects.aget(
            user_id=user_status["user_id"],
            channel_name=user_status["channel_name"],
        )
        await connections.adelete()
    except:
        pass

    await RabbitmqManager().publish_message(
        message=orjson.dumps(
            {
                "type"    : "user_status",
                "user_id" : user_status["user_id"],
                "status"  : "disconnected",
            }
        ),
        exchange_name=PUBLISH_EXCHANGE,
    )
