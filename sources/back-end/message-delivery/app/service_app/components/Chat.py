
from django.db import models

# **************************************************************************** #
#   * Chat Manager :                                                           #
# **************************************************************************** #
class ChatManager(models.Manager):

    #=== acreate : =============================================================
    async def acreate(self, user1_id: str, user2_id: str) -> "Chat":
        """
        Creates a chat between two users.
        If the chat already exists, it is returned.
        """
        if user1_id > user2_id:
            user1_id, user2_id = user2_id, user1_id

        try:
            return await self.aget(user1=user1_id, user2=user2_id)
        except self.model.DoesNotExist:
            pass

        chat = await super().acreate(user1=user1_id, user2=user2_id)
        return chat


# **************************************************************************** #
#   * Chats Model :                                                            #
# **************************************************************************** #
class Chat(models.Model):

    objects :ChatManager = ChatManager()

    #=== fields : ===============================================================
    user1      = models.CharField(max_length=255, blank=False)
    user2      = models.CharField(max_length=255, blank=False)
    blocked_by = models.CharField(max_length=255, null=True, blank=True)

    #=== class Metadata : ======================================================
    class Meta:
        unique_together = ('user1', 'user2')
