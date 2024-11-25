


###############Intra Serializer#################
from rest_framework import serializers
from .register_with_provider import RegisterWithProviderSerializer
from authentication_app.models import CustomUser
import random
from django.utils.text import slugify


class Intra42Serializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    given_name = serializers.CharField(required=True)
    provider = serializers.CharField(required=True)

    def create(self, validated_data):
        return RegisterWithProviderSerializer.create(validated_data)
