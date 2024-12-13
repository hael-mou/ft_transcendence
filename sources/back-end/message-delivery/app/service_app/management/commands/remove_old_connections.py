
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from service_app.components.Connection import Connection

# **************************************************************************** #
#   * Command Class :  remove old connections                                  #
# **************************************************************************** #
class Command(BaseCommand):
    help = 'Remove all connections registered before 1 hour ago'

    def handle(self, *args, **kwargs):
        one_hour_ago = timezone.now() - timedelta(hours=1)
        old_connections = Connection.objects.filter(connect_at__lt=one_hour_ago)
        count = old_connections.count()
        old_connections.delete()

        self.stdout.write(self.style.SUCCESS(f"Removed {count} old connections"))
