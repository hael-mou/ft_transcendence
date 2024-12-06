
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
    _serializer_class = api_settings.TOKEN_REFRESH_SERIALIZER

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            refresh_token = request.COOKIES.get('r_token')
            if not refresh_token:
                return Response({"message": "Refresh token not found"},
                                status=status.HTTP_403_FORBIDDEN)

            request.data["refresh"] = refresh_token
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data

            response = Response(
                {"access": validated_data["access"]},
                status=status.HTTP_200_OK
            )
            return response

        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_403_FORBIDDEN)
