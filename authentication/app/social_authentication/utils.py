from rest_framework.response import Response
from rest_framework import status
import os

def handle_oauth_callback(request, user_info, serializer_class, domain):
    serializer = serializer_class(data=user_info)
    if serializer.is_valid(raise_exception=True):
        user_data = serializer.save()
        response = Response({
            "message": "Login successful",
            "email": user_data["email"],
            "access": user_data["tokens"]["access"]
        }, status=status.HTTP_200_OK)
        response.set_cookie(
            key ='r_token',
            value = str(user_data["tokens"]["refresh"]),
            httponly = True,
            secure = True,
            samesite = "Strict",
            max_age = 1800,
            expires = 1800,
            path= os.environ.get("REFRESH_TOKEN_PATH"),
            domain = domain,
        )
        request.session.flush()
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
