
from service_app.models import Player
from rest_framework.authentication import BaseAuthentication


class AuthenticationWithID(BaseAuthentication):
    """Authenticate users using the 'X-User-Id' header."""

    def authenticate(self, request):
        user_id_header       = request.headers.get('X-User-Id')
        if not user_id_header:
            return None

        try:
            user_id = int(user_id_header)
            user = Player.objects.get(id=user_id)

        except (ValueError, Player.DoesNotExist):
            user = Player.objects.create(id=user_id)

        return (user, None)
