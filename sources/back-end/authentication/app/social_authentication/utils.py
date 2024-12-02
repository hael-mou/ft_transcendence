from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.settings import api_settings
import os

def handle_oauth_callback(request, user_info, serializer_class):
    serializer = serializer_class(data=user_info)
    if serializer.is_valid(raise_exception=True):
        user_data = serializer.save()
        response = Response(status=status.HTTP_302_FOUND)
        response.set_cookie(
            key="r_token",
            value=str(user_data["tokens"]["refresh"]),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
            path=os.environ.get("REFRESH_TOKEN_PATH"),
        )
        response["Location"] = 'https://127.0.0.1/'
        request.session.flush()
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
