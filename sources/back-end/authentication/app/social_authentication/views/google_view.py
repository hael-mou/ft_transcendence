from rest_framework.views import APIView
from ..serializers.google_serialiazer import GoogleSocialAuthSerializer
from rest_framework.response import Response
from rest_framework import status
import requests
from django.conf import settings
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from django.shortcuts import redirect
from google.auth.transport import requests
from social_authentication.utils import handle_oauth_callback

########################## Creting Instance of FLow for Google ###############################
flow = Flow.from_client_secrets_file(
    settings.GOOGLE_OAUTH2_CLIENT_SECRET_FILE,
    scopes=[
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid'
        ],
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
        autogenerate_code_verifier=True
)

########################## CallBack View ######################################################

class GoogleSocialAuthCallback(APIView):
    """Callback view for Google Social Auth"""

    serializer_class = GoogleSocialAuthSerializer

    def get(self, request):
        try:
            authorization_code = request.GET.get("code")
            session_state = request.GET.get("state")
            code_verifier = request.session.get("code_verifier")
            if session_state != request.session.get("state"):
                del request.session["state"]
                return Response({"message": "Invalid state"}, status=status.HTTP_400_BAD_REQUEST)

            flow.fetch_token(code=authorization_code, code_verifier=code_verifier)
            credentials = flow.credentials
            id_token_info = id_token.verify_oauth2_token(
                credentials.id_token,
                requests.Request()
            )
            if "accounts.google.com" in id_token_info["iss"]:
                return handle_oauth_callback(request, id_token_info,
                                             self.serializer_class)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


########################## Starting Flow  #######################################################
class GoogleOAuth2Registrer(APIView):
    """View for Google OAuth2 registration"""

    def get(self, request):
        try:
            auth_url, state = flow.authorization_url(prompt='consent')
            request.session['state'] = state
            request.session["code_verifier"] = flow.code_verifier
        except Exception as e:
            return Response({"Ooops something went wrong": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return redirect(auth_url)
