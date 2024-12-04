from rest_framework import generics
from service_app.models import Profile
from rest_framework.authentication import BaseAuthentication


class AuthenticationWithID(BaseAuthentication):
    """Class for authenticated users to get user ID."""

    def authenticate(self, request):
        user_id = request.headers.get('X-User-Id')
        if user_id is None:
            return None

        try:
            user = Profile.objects.get(id=int(user_id))
        except (ValueError, Profile.DoesNotExist):
            return None

        return user, None
