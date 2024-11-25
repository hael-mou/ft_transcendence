import os
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from .register_with_provider import RegisterWithProviderSerializer

class GoogleSocialAuthSerializer(serializers.Serializer):
    sub = serializers.CharField(required=True)
    name = serializers.CharField(required=False)
    given_name = serializers.CharField(required=False)
    family_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=True)
    picture = serializers.URLField(required=False)
    azp = serializers.CharField(required=False)
    email_verified = serializers.BooleanField(required=True)
    at_hash = serializers.CharField(required=False)
    iat = serializers.IntegerField(required=False)
    exp = serializers.IntegerField(required=False)
    aud = serializers.CharField(required=True)


    def validate(self, attrs):
        try:
            attrs['sub']
        except:
            raise serializers.ValidationError({'error':'No sub provided'})
        if attrs['aud'] != os.environ.get('GOOGLE_OAUTH2_CLIENT_ID'):
            raise AuthenticationFailed({'error':'Oops, who are you?'})
        attrs= {
            'email': attrs['email'],
            'given_name': attrs['given_name'],
            'provider': 'google',}
        return (attrs)

    def create(self, validated_data):
        return RegisterWithProviderSerializer.create(validated_data)
