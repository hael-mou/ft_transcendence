
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from service_app.components.Connection import Connection

# **************************************************************************** #
#   * Command Class :  remove old connections                                  #
# **************************************************************************** #
class Command(BaseCommand):
    help = 'Remove all connections registered'

    def handle(self, *args, **kwargs):
        connections = Connection.objects.all()
        count = connections.count()
        connections.delete()

        self.stdout.write(self.style.SUCCESS(f"Removed {count} old connections"))
