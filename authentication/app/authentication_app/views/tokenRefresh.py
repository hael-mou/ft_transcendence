
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework_simplejwt.settings import api_settings

class TokenRefreshView(TokenViewBase):
    """ 
    Takes a refresh type Cookie and returns an access type JSON web, and 
    refresh set in Cookie if the refresh token is valid.
    """

    def post(self, request: Request, *args, **kwargs) -> Response:
        refresh = request.COOKIES.get('r_token')
        if not refresh:
            return Response({"message": "Refresh token not found in cookies"}, status=status.HTTP_400_BAD_REQUEST)
        request.data["refresh"] = refresh
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            response = Response(
                    {"access": serializer.validated_data["access"]},
                    status=status.HTTP_200_OK
            )
            if api_settings.ROTATE_REFRESH_TOKENS:
                response.set_cookie(
                    key="r_token",
                    value=serializer.validated_data["refresh"],
                    httponly=True,
                    secure=True,
                    samesite="Lax",
                    max_age=api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)