##############################Imports########################################
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializers.logout import TokenSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
####################################Logout###################################

class LogoutView(generics.GenericAPIView):

    """ View for logout for revoking tokens"""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TokenSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.set_cookie("r_token", "", httponly=True, secure=True, samesite="Lax", max_age=0, expires=0)
        return response
