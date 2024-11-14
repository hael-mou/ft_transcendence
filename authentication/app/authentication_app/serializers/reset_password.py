from rest_framework import serializers
from authentication_app.models import CustomUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from rest_framework.exceptions import AuthenticationFailed
from django.utils.http import urlsafe_base64_decode
from service_core.settings import PASSWORD_POLICY
######################### Password Reset Serializer ##############################################

class PasswordResetSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ['email']
    
    def create(self, validated_data):
        try:
            user = CustomUser.objects.get(email=validated_data['email'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'error': 'User with this email does not exist.'})
        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
        port=":"+str(self.context["request"].META.get('SERVER_PORT'))
        current_site = get_current_site(self.context["request"]).domain
        resetLink = "http://"+current_site+relativeLink+"?token="+str(token)
        return resetLink
    

########################### Set New Password Serializer ###########################################
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            user_id = force_str(urlsafe_base64_decode(uidb64))

            PASSWORD_POLICY.test(password)
            user = CustomUser.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed({'error': 'The reset link is invalid'}, 401)
            attrs['user'] = user
            return (attrs)
        except PASSWORD_POLICY.PasswordPolicyError as e:
            raise serializers.ValidationError({'error': str(e)})
        except Exception as e:
            raise AuthenticationFailed({'error': 'The reset link is invalid'}, 401)
    

    def create(self, validated_data):
        user = validated_data['user']
        user.set_password(validated_data['password'])
        user.save()
        return user