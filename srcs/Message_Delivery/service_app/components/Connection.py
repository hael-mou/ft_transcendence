
from django.db import models

# **************************************************************************** #
#   * Connection Model :                                                       #
# **************************************************************************** #
class Connection(models.Model):

    #=== fields : ===============================================================
    user_id      = models.CharField(max_length=255, blank=False)
    server_name  = models.CharField(max_length=255, blank=False)
    channel_name = models.CharField(max_length=255, blank=False)
    connect_at   = models.DateTimeField(auto_now_add=True)
