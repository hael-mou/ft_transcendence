from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from authentication_app.serializers.change_password import ChangePasswordSerializer

class ChangePasswordView(generics.UpdateAPIView):

    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        """
        Overrided method to use a custom serializer class.
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_serializer_class()
        kwargs.setdefault('context', {'request': self.request})
        return serializer_class(*args, **kwargs)