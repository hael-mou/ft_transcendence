from authlib.integrations.django_client import OAuth
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings
import os
from ..serializers.intra_serializer import Intra42Serializer
from ..utils import handle_oauth_callback

oauth = OAuth()

oauth.register(
    name='42',
    client_id=settings.AUTHLIB_OAUTH_CLIENTS['42']['client_id'],
    client_secret=settings.AUTHLIB_OAUTH_CLIENTS['42']['client_secret'],
    api_base_url=settings.AUTHLIB_OAUTH_CLIENTS['42']['api_base_url'],
    access_token_url=settings.AUTHLIB_OAUTH_CLIENTS['42']['access_token_url'],
    authorize_url=settings.AUTHLIB_OAUTH_CLIENTS['42']['authorize_url'],
)
intra_client = oauth.create_client('42')

class Intra42AuthView(APIView):
    def get(self, request):
        redirect_uri = settings.AUTHLIB_OAUTH_CLIENTS['42']['redirect_uri']
        return intra_client.authorize_redirect(request=request, redirect_uri=redirect_uri)


class Intra42AuthCallbackView(APIView):
    """View for 42 Intra OAuth2 registration"""

    serializer_class = Intra42Serializer

    def get(self, request):
        """Callback for 42 Intra OAuth2 registration"""

        client = oauth.create_client('42')
        token = client.authorize_access_token(request)
        user_info = client.get(
            os.path.join(settings.AUTHLIB_OAUTH_CLIENTS['42']['api_base_url'], 'me'),
            token=token
        ).json()
        user_info = {
            'email': user_info['email'],
            'given_name': user_info['login'],
            'provider': '42intra',
        }
        return handle_oauth_callback(request, user_info, self.serializer_class)
