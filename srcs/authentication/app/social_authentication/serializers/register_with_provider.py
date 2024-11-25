
from authentication_app.models import CustomUser
import random
from django.utils.text import slugify


class RegisterWithProviderSerializer:
    """Class for registering a user with a provider"""

    @staticmethod
    def _generate_username(name: str) -> str:
        """Generate a username from a name"""
        username = slugify(name)
        unique_suffix = str(random.randint(1000, 9999))
        generated_username = f"{username}{unique_suffix}"
        if not CustomUser.objects.filter(username=generated_username).exists():
            return generated_username
        return RegisterWithProviderSerializer._generate_username(name)

    @staticmethod
    def create(validated_data: dict) -> dict:
        """Register a user with a provider"""
        
        user, created = CustomUser.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "auth_provider": validated_data["provider"],
            },
        )
        if created:
            user.username = RegisterWithProviderSerializer._generate_username(
                validated_data["given_name"]
            )
            user.save()
        return {
            "email": user.email,
            "tokens": user.tokens(),
        }

