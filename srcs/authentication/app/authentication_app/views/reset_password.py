##################################### Include ######################################################################
from .utils import Util
from ..models import CustomUser
import os
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, DjangoUnicodeDecodeError
from ..serializers.reset_password import PasswordResetSerializer, SetNewPasswordSerializer

# ############################### Password Reset View ###############################################################
class PasswordResetView(generics.GenericAPIView):
    """View for password reset that takes an email and sends a password reset link"""

    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        reset_link = serializer.save()
        try:
            Util.send_reset_password_email(serializer.validated_data["email"], reset_link=reset_link)
        except:
            return Response({"message": "Email not sent"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Password reset email sent successfully"}, status=status.HTTP_200_OK)


####################################### Password Reset Confirmation View ##############################################
class PasswordResetConfirmView(APIView):
    """Password reset confirmation view via email link sent to the user."""

    def get(self, request, uidb64, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.filter(id=user_id).first()
            if not user:
                return Response(
                    {"error": "User does not exist"},
                    status=status.HTTP_404_NOT_FOUND)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response(
                    {"error": "Token is not valid, please request a new one"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            response = Response(status=status.HTTP_302_FOUND)
            response["Location"] = (
                f"{os.environ.get('SET_NEW_PASSWORD_URL')}?uidb64={uidb64}&token={token}"
            )
        except DjangoUnicodeDecodeError:
            return Response(
                {"error": "Token is not valid, please request a new one"},
                status=status.HTTP_401_UNAUTHORIZED)
        return response

############################################ Password Reset Set New Password View ########################################
class SetNewPasswordView(generics.GenericAPIView):
    """
    View for setting a new password after a user has reset their password
    via the password reset link sent to their email.
    """
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(
                {"success": True, "message": "Password reset success"},
                status=status.HTTP_200_OK)
