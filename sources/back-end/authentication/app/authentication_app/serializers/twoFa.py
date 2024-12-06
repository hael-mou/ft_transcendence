import jwt
import os
from django.conf import settings
from rest_framework import serializers
from authentication_app.models import CustomUser
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_email.models import EmailDevice


class TwoFASerializer(serializers.Serializer):
    """Serializer for enabling and disabling two-factor authentication"""

    password = serializers.CharField(write_only=True)
    choice = serializers.CharField(max_length=255, write_only=True)
    device = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['is_2fa_enabled', 'password', 'choice', 'device']

    def validate(self, attrs):
        password = attrs.get('password')
        choice = attrs.get('choice')
        user = self.context['request'].user
        to_enable = self.context['toEnable']
        attrs = {
            'instance': user, 
            'toEnable': to_enable
        }
        if choice not in ["email", "totp"]:
            raise serializers.ValidationError({'error': 'Invalid choice'})
        if not user.check_password(password):
            raise serializers.ValidationError({'error': 'Invalid credentials'})
        attrs['choice'] = choice
        device_model = TOTPDevice if choice == "totp" else EmailDevice
        if to_enable:
            if device_model.objects.devices_for_user(user):
                device_model.objects.all().delete()
            device = device_model.objects.create(user=user, name="Pingo")
            device.save()
            attrs['device'] = device
        else:
            device_model.objects.filter(user=user, name="Pingo").delete()

        return attrs

    def update(self, validated_data):
        instance = validated_data['instance']
        instance.is_2fa_enabled = validated_data['toEnable']
        instance.two_fa_choice = validated_data['choice']
        instance.save()
        return instance

# to test if verified and change later the secrets of jwt token
class Verify2faSerializer(serializers.Serializer):
    """OTP Serializer for OTP verification"""

    otp = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        otp = attrs.get('otp')
        jwt_token = self.context['request'].COOKIES.get('token')
        if jwt_token is None:
            raise serializers.ValidationError({'error': 'cookie not found'}) 
        try:
            decoded_token  = jwt.decode(jwt_token, key=os.environ.get("JWT_2FA_SECRET"), algorithms="HS256")
            email = decoded_token.get('sub')
            if not email:
                raise serializers.ValidationError({'error': 'Invalid email in the token.'})
            user = CustomUser.objects.get(email=email)
            device_type = TOTPDevice if user.two_fa_choice == "totp" else EmailDevice
            
            device =  device_type.objects.get(user=user, name="Pingo")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'error': 'Invalid credentials'})
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({'error': 'Token expired'})
        except jwt.DecodeError as e:
            raise serializers.ValidationError({'error': 'Invalid token'})
        except device_type.DoesNotExist:
            raise serializers.ValidationError({'error': 'Invalid credentials'})
        if not device.verify_token(otp):
            raise serializers.ValidationError({'error': 'Invalid OTP'})
        return {
            "username": user.username,
            "email": user.email,
            "is_2fa_enabled": user.is_2fa_enabled,
            'tokens': user.tokens(),
        }