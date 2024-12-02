from ..serializers.login import LoginSerializer
from .utils import Util
from  rest_framework import generics

#################################Login###################################
class LoginView(generics.GenericAPIView):
    """View for user login that takes email and password and returns
    access and refresh token"""

    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        if validated_data["is_2fa_enabled"] is True:
            response = Util.build_2fa_response(validated_data)
        else:
            response = Util.build_response(validated_data)
        return response
