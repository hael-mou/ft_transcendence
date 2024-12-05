import os
import jwt
import requests
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from datetime import datetime, timedelta
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from rest_framework.response import Response
from django_otp.plugins.otp_email.models import EmailDevice
from rest_framework import status
from ..models import CustomUser
from rest_framework_simplejwt.settings import api_settings

class Util:
    @staticmethod
    def generate_token(payload):
        token = jwt.encode(payload=payload, key=os.environ.get("VERIFICATION_EMAIL_JWT_SECRET"), algorithm="HS256")
        return token

    @staticmethod
    def create_email_data(request, email, token):
        current_site = get_current_site(request)
        relativeLink = reverse("email-verify")
        absoluteLink = "https://"+current_site.domain+"/auth"+relativeLink+"?token="+str(token)
        verification_link = absoluteLink
        subject = "Verify your email"
        html_message = render_to_string('email.html', {'verification_link': verification_link})
        plain_message = strip_tags(html_message)
        from_email = 'Pingo <' + os.environ.get("EMAIL_USER") + '>'
        to = email
        email = EmailMultiAlternatives(subject, plain_message, from_email, [to])
        email.attach_alternative(html_message, "text/html")
        email.send()

    @staticmethod
    def send_verificationEmail(request, email):
        payload = {
            "sub": email,
            'exp': datetime.now() + timedelta(hours=1),
            'iss': "micros/auth_verify_email",
            'scope': 'verifyEmailLink',
            'redirecType': 'signup',
            'action': "verify-email",
        }
        token = Util.generate_token(payload=payload)
        Util.create_email_data(request, email, token)

    @staticmethod
    def build_response(validated_data):
        response = Response(
            {
                "message": "Login successful",
                "username": validated_data["username"],
                "email": validated_data["email"],
                "access": validated_data["tokens"]["access"],
            },
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key="r_token",
            value=str(validated_data["tokens"]["refresh"]),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
            path=os.environ.get("REFRESH_TOKEN_PATH"),
        )
        return response

    @staticmethod
    def build_2fa_response(validated_data):
        if validated_data["two_fa_choice"] == "email":
            user = CustomUser.objects.filter(email=validated_data["email"]).first()
            try:
                device = EmailDevice.objects.get(user=user, name="Pingo")

                device.generate_challenge()
            except EmailDevice.DoesNotExist:
                return Response(
                    {
                        "error": "User not enabled 2fa with email",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

        response = Response(
            {
                "2fa_enabled": "true",
                "email": validated_data["email"],
            },
            status=status.HTTP_200_OK,
        )
        payload = {
            "sub": validated_data["email"],
            'exp': datetime.now() + timedelta(minutes=10),
            'iss': "micros/2fa",
            'scope': '2fa',
            'redirecType': 'login',
            'action': "complete login",
        }
        jwt_token = jwt.encode(payload=payload, key=os.environ.get("JWT_2FA_SECRET"), algorithm="HS256")
        response.set_cookie(
            key="token",
            value=str(jwt_token),
            httponly=True,
            secure=True, 
            samesite="lax",  
            max_age=timedelta(minutes=10).total_seconds(),
            path=os.environ.get("TWO_FA_PATH"),
        )
        return response
    @staticmethod
    def send_reset_password_email(email, reset_link):
        subject = "Reset your password"
        html_message = render_to_string('reset_password.html', {'reset_link': reset_link})
        plain_message = strip_tags(html_message)
        from_email = 'Pingo <' + os.environ.get("EMAIL_USER") + '>'
        to = email
        email = EmailMultiAlternatives(subject, plain_message, from_email, [to])
        email.attach_alternative(html_message, "text/html")
        email.send()
