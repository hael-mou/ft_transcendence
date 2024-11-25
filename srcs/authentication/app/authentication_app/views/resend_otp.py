from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from ..serializers.resend_otp import ResendOtpSerializer
from .utils import Util
class ResendOtpView(generics.GenericAPIView):
    serializer_class = ResendOtpSerializer
    def get(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            return Util.build_2fa_response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)