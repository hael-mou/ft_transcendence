from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from authentication_app.serializers.change_username import ChangeUsernameSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class ChangeUsernameView(generics.UpdateAPIView):

    serializer_class = ChangeUsernameSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
