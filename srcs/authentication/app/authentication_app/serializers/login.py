
####################################Login###################################
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from ..models import CustomUser

class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    username = serializers.CharField(required=False, read_only=True)
    tokens = serializers.SerializerMethodField(method_name='get_tokens', read_only=True)

    def get_tokens(self, obj):
        user = CustomUser.objects.get(email=obj['email'])
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'username', 'tokens']

    def validate(self, attrs):
        email= attrs.get('email', '')
        password = attrs.get('password', '')
        user = CustomUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            raise AuthenticationFailed({'error': 'Invalid credentials'})
        return {
            'email': user.email,
            'username': user.username,
            'tokens': user.tokens(),
            'is_2fa_enabled' : user.is_2fa_enabled,
            'two_fa_choice' : user.two_fa_choice
        }
