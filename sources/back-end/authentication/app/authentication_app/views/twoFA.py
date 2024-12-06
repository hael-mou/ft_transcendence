import os
import qrcode
import base64
from io import BytesIO
from .utils import Util
from ..models import CustomUser
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_otp.plugins.otp_totp.models import TOTPDevice
from ..serializers.twoFa import TwoFASerializer, Verify2faSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class Enable2FaView(generics.GenericAPIView):
    """View for enabling 2FA."""

    authentication_classes = [JWTAuthentication]
    serializer_class = TwoFASerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request, "toEnable": True},
            partial=True
        )

        if serializer.is_valid(raise_exception=True):
            user = serializer.update(serializer.validated_data)
            if user.is_2fa_enabled:
                return Response(
                    {"two_factor_enabled": user.is_2fa_enabled},
                    status=status.HTTP_200_OK
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
   
class Disable2FaView(generics.GenericAPIView):
    """ View for disabling 2FA. """

    serializer_class = TwoFASerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, 
            context={"request": request, 'toEnable': False}, 
            partial=True)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.update(serializer.validated_data)
            if user.is_2fa_enabled is False:
                return Response(
                    {"two_factor_enabled": user.is_2fa_enabled}, 
                    status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CodeQrGenerator(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    """ Generates QR code for 2FA , Assuming the user enabled 2FA. """

    def get(self, request):
        user = request.user
        if user.is_2fa_enabled is False:
            return Response({"message": "2FA not enabled"}, status=status.HTTP_400_BAD_REQUEST)
        if user.two_fa_choice != "totp":
            return Response({"message": "2FA with email enabled"}, status=status.HTTP_400_BAD_REQUEST)
        device = TOTPDevice.objects.filter(user=user, name="Pingo").first() # env
        otp_uri = device.config_url

        qr = qrcode.make(otp_uri)
        buffer = BytesIO()
        qr.save(buffer, "PNG")
        buffer.seek(0)
        try:
            img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"qr_code": img_base64}, status=status.HTTP_200_OK)
    

class Verify2FaView(generics.GenericAPIView):
    """ View for verifying 2FA. """

    serializer_class = Verify2faSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            response = Util.build_response(serializer.validated_data)
            response.set_cookie(
                key="token",
                value="",
                httponly=True,
                secure=True,
                samesite="lax",  
                max_age=0,
                expires=0,
                path=os.environ.get("TWO_FA_PATH")
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)