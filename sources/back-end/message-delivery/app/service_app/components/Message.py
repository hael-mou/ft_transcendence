
from service_app.components.Chat import Chat
from rest_framework import serializers
from django.db import models
from typing import Dict

# **************************************************************************** #
#   * Message Manager :                                                        #
# **************************************************************************** #
class MessageManager(models.Manager):

    #=== acreate: ==============================================================
    async def acreate(self, message_data: Dict, chat: Chat) -> "Message":
        """
        Creates a message instance and saves it to the database.
        """
        message_data.pop('recipient_id', None)
        message = self.model(
            **message_data,
            chat=chat,
        )
        await message.asave()
        return message


# **************************************************************************** #
#   * Message Model :                                                          #
# **************************************************************************** #
class Message(models.Model):

    objects = MessageManager()

    #=== status : ==============================================================
    class Status(models.TextChoices):
        """The status of the message."""
        SENT      = 'sent', 'Sent'
        DELIVERED = 'delivered', 'Delivered'
        READ      = 'read', 'Read'


    #=== fields : ===============================================================
    sender_id       = models.CharField(max_length=255)
    tracking_no     = models.CharField(max_length=255, blank=False)
    sent_at         = models.BigIntegerField(blank=False)
    content_type    = models.CharField(max_length=255, blank=False)
    body            = models.TextField(max_length=500, blank=False)
    chat            = models.ForeignKey('Chat', on_delete=models.CASCADE,
                                        blank=False)
    status          = models.CharField(max_length=10, choices=Status.choices,
                                       default=Status.SENT)


# **************************************************************************** #
#   * Message Serializer :                                                     #
# **************************************************************************** #
class MessageSerializer(serializers.ModelSerializer):

    #=== fields : ===============================================================
    recipient_id = serializers.CharField(write_only=True)


    #=== class Metadata : ======================================================
    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ("id", "status", "chat")
        write_only_fields = ("recipient_id", )


    #=== acreate : =============================================================
    async def acreate(self, validated_data):
        chat = await Chat.objects.acreate(
            user1_id=validated_data["sender_id"],
            user2_id=validated_data["recipient_id"]
        )
        message = await Message.objects.acreate(validated_data, chat)
        return message
