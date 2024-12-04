from rest_framework import serializers
from authentication_app.models import CustomUser

class ChangeUsernameSerializer(serializers.Serializer):
    """
    Serializer for changing the username of a user.
    """
    username = serializers.CharField(required=True)

    def update(self, instance, validated_data):
        """
        Updates the username of the user.
        """
        instance.username = validated_data['username']
        instance.save()
        return instance
