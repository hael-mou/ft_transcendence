
from rest_framework.authentication import BaseAuthentication

# **************************************************************************** #
#   * AUTHENTICATION :                                                         #
# **************************************************************************** #
class AuthenticationWithID(BaseAuthentication):
    """Authenticate users using the 'X-User-Id' header."""

    #=== authenticate : =======================================================
    def authenticate(self, request):
        user_id_header       = request.headers.get('X-User-Id')
        user_username_header = request.headers.get('X-User-Username')
        if not user_id_header or not user_username_header:
            return None

        user = {"id": user_id_header, "username": user_username_header}
        return (user, None)
