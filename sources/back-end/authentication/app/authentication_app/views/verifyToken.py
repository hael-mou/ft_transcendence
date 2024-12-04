
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class TokenVerifyView(TokenViewBase):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({"message": "success"}, status=status.HTTP_200_OK)
        response["X-User-Id"] = request.user.id
        response["X-User-Username"] = request.user.username
        return response
