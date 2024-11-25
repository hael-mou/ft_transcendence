

from rest_framework import serializers
from authentication_app.models import CustomUser
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_email.models import EmailDevice
from django.conf import settings
import os, jwt

class ResendOtpSerializer(serializers.Serializer):
    
    def validate(self, attrs):
        jwt_token = self.context['request'].COOKIES.get('token')
        try:
            decoded_token  = jwt.decode(jwt_token, key=os.environ.get("JWT_SECRET"), algorithms="HS256")
            email = decoded_token.get('sub')
            if not email:
                raise serializers.ValidationError({'error': 'Invalid email in the token.'})
            user = CustomUser.objects.get(email=email)
            if user.two_fa_choice != "email":
                raise serializers.ValidationError({'error': 'user not enabled 2fa'})
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'error': 'Invalid credentials'})
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({'error': 'Token expired'})
        except jwt.DecodeError as e:
            raise serializers.ValidationError({'error': 'Invalid token'})
        return {
            "username": user.username,
            "email": user.email,
            "is_2fa_enabled": user.is_2fa_enabled,
            'tokens': user.tokens(),
            "two_fa_choice": "email"
        }