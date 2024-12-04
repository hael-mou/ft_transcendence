from rest_framework import generics
from service_app.models import Profile
from rest_framework.authentication import BaseAuthentication


class AuthenticationWithID(BaseAuthentication):
    """Authenticate users using the 'X-User-Id' header."""

    def authenticate(self, request):
        user_id_header       = request.headers.get('X-User-Id')
        user_username_header = request.headers.get('X-User-Username')
        if not user_id_header or not user_username_header:
            return None

        try:
            user_id = int(user_id_header)
            user = Profile.objects.get(id=user_id)

            if user.username != user_username_header:
                user.username = user_username_header
                user.save()

        except (ValueError, Profile.DoesNotExist):
            user = Profile.objects.create(id=user_id, username=user_username_header)

        return (user, None)
