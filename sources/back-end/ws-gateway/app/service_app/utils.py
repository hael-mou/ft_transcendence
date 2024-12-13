
import json

from enum import Enum

# **************************************************************************** #
#   * UserStatus Enum:                                                         #
# **************************************************************************** #
class UserStatus(Enum):
    """Enum for user connection status."""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"


# **************************************************************************** #
#   * message module:                                                          #
# **************************************************************************** #
class Message:
    #=== Dictionary ========================================================== #
    REQUIRED_KEYS = {
        "global": {
            "type": str,
            "recipient_id": str,
        },

        "chat": {
            "tracking_no": str,
            "content_type": str,
            "status": str,
            "body": str,
        },

        "ack": {
            "tracking_no": str,
            "status": str,
        },
    }


    ALLOWED_VALUES = {
        "type": ["chat" , "ack"],
        "status": ["sent", "delivered", "read"]
    }


    ROUTING = {
        "chat": {
            "exchange_name": "--new-message",
            "queue_name"   : "",
        },
        "ack": {
            "exchange_name": "--new-message",
            "queue_name"   : "",
        },
    }

    #=== Initialization ======================================================= #
    def __init__(self, message_text: str):
        """Initializes a Message object from a user and a JSON message."""

        try:
            self.message = json.loads(message_text)
            message_type = self.message.get("type")

            if not message_type or message_type not in self.ALLOWED_VALUES["type"]:
                raise ValueError("Invalid message type")

            global_keys   = self.REQUIRED_KEYS.get("global", {})
            specific_keys = self.REQUIRED_KEYS.get(message_type, {})
            required_keys = {**global_keys, **specific_keys}

            unexpected_keys = set(self.message.keys()) - set(required_keys.keys())
            if unexpected_keys:
                raise ValueError(f"Message contains unexpected keys: {unexpected_keys}")

            for key, expected_type in required_keys.items():
                if key not in self.message:
                    raise ValueError(f"Message is missing required key: {key}")

                if not isinstance(self.message[key], expected_type):
                    raise ValueError(
                        f"Message key {key} has invalid type. "
                        f"Expected {expected_type.__name__}, got "
                        f"{type(self.message[key]).__name__}"
                    )

                if key in self.ALLOWED_VALUES and \
                   self.message[key] not in self.ALLOWED_VALUES[key]:
                    raise ValueError(
                        f"Message key {key} has invalid value. "
                        f"Allowed values are {self.ALLOWED_VALUES[key]}"
                    )

        except json.JSONDecodeError as error:
            raise ValueError("Invalid JSON format") from error


    #=== post: ================================================================= #
    def post(self) -> dict:
        """Returns the publish arguments for RabbitMQ."""

        message_type = self.message.get("type")
        routing = self.ROUTING.get(message_type, {})

        publish_args = {
            "message": json.dumps(self.message).encode(),
            "queue_name": routing.get("queue_name", ""),
            "exchange_name": routing.get("exchange_name", ""),
        }

        return publish_args


    #=== user_from : ===========================================================
    @property
    def user_from(self) -> str:
        """Returns the user ID of the message sender."""
        return self.message["sender_id"]

    @user_from.setter
    def user_from(self, user_id: str) -> None:
        """Sets the user ID of the message sender."""
        self.message["sender_id"] = user_id


    #=== timestamp : ===========================================================
    @property
    def timestamp(self) -> int:
        """Returns the message timestamp."""
        return self.message["sent_at"]

    @timestamp.setter
    def timestamp(self, timestamp: int) -> None:
        """Sets the message timestamp."""
        self.message["sent_at"] = timestamp
