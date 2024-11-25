from rest_framework import serializers
from service_core.settings import PASSWORD_POLICY

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        fields = ['old_password', 'new_password']

    def validate(self, attrs):
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        user = self.context['request'].user
        if not user.check_password(old_password):
            raise serializers.ValidationError({'error': 'Invalid credentials'})
        try:
            PASSWORD_POLICY.test(new_password)
        except PASSWORD_POLICY.PasswordPolicyError as e:
            raise serializers.ValidationError({'error': str(e)})
        attrs['user'] = user
        return attrs
    
    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user