import os
import jwt
from rest_framework import serializers
from datetime import datetime, timedelta
from authentication_app.models import CustomUser
from service_core.settings import PASSWORD_POLICY

######################################Sign Up Serializer########################################
class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        if email and CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                    {'error': 'User with this email already exists.'}, code='user_verified'
                )
        return super().validate(attrs)
    

######################################Email Verification Serializer################################
class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=500)

    EXPECTED_ACTION = "verify-email"
    EXPECTED_REDIRECT_TYPE = "signup"
    EXPECTED_SCOPE = "verifyEmailLink"
    EXPECTED_ISSUER = "micros/auth_verify_email"

    def validate(self, attrs):
        token = attrs.get("token")
        try:
            payload = jwt.decode(
                token, os.environ["VERIFICATION_EMAIL_JWT_SECRET"], algorithms=["HS256"]
            )
            if (
                payload.get("action") != self.EXPECTED_ACTION
                or payload.get("redirecType") != self.EXPECTED_REDIRECT_TYPE
                or payload.get("scope") != self.EXPECTED_SCOPE
                or payload.get("iss") != self.EXPECTED_ISSUER
            ):
                raise serializers.ValidationError({"error": "Verification link is invalid."}, code="Verification link is invalid")

            email = payload.get("sub")
            if not email:
                raise serializers.ValidationError({"error": "Invalid email in the token."})

        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({"error":"Verification link has expired."}, code="expired")
        except jwt.DecodeError:
            raise serializers.ValidationError({"error":"Invalid or malformed token."})
        except jwt.InvalidTokenError:
            raise serializers.ValidationError({"error":"Invalid token."}, code="Invalid token.")
    
        validated_data = {"email": email}
        return validated_data


    def create(self, validated_data):
        payload = {
            "action": "complete_profile",
            "sub": validated_data["email"],
            "scope": "welcome",
            "iss": "micros/sign-up", 
            "exp": int((datetime.now() + timedelta(minutes=10)).timestamp()),  
        }
        token = jwt.encode(
            payload=payload, key=os.environ["CompleteProfile_JWT_SECRET"], algorithm="HS256"
        )
        
        return token
    

######################## Complet Profile Serializer #########################################       
class CompleteProfileSerializer(serializers.ModelSerializer):

    password = serializers.CharField(max_length=255, required=True)
    username = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email']

    def validate(self, attrs):
        token = self.context['request'].COOKIES.get('token')

        if token is None:
            raise serializers.ValidationError({'error': 'Token not found in cookies.'})
        email = self._get_email_from_token(token)

        if email is None:
            raise serializers.ValidationError({'error': 'Invalid token.'})

        password = attrs.get('password')
        errors = PASSWORD_POLICY.test(password)
        if len(errors) > 0:
            raise serializers.ValidationError({'error': 'Password does not meet the requirements.'})
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({'error': 'User already exists.'})
        attrs['email'] = email
        return attrs


    def create(self, validated_data):
        user = CustomUser.objects.create_user(email=validated_data['email'], 
                                         username=validated_data['username'],
                                         password=validated_data['password'])
        user.is_complete = True
        user.save()
        return user

    def _get_email_from_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, key=os.environ["CompleteProfile_JWT_SECRET"]
                                 , algorithms=["HS256"], verify=True)

        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({'error': 'Token has expired.'})
        except jwt.DecodeError:
            raise serializers.ValidationError({'error': 'Invalid token.'})
        except jwt.InvalidTokenError as e:
            raise serializers.ValidationError({'error': 'Invalid token.'})
        return payload.get('sub')
