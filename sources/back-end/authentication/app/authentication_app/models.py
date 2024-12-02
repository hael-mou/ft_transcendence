from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from datetime import datetime, timedelta
import secrets
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class CustomUserManger(BaseUserManager):
    """UserManager Model for Authentication App"""

    def create_user(self, username, email, password=None):

        """Create and save a User with the given email and password."""
        if username is None:
            raise ValueError("The given username must be set")
        if email is None:
            raise ValueError("The given email must be set")

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None):
        """Create and save a SuperUser with the given email and password."""
        user = self.create_user(username, email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class CustomUser(AbstractUser, PermissionsMixin):
    TWO_FA_TYPE = [
        ('totp', 'TOTP'),
        ('email', 'Email'),
        # ('sms', 'SMS'), # not implemented yet, maybe later
    ]


    username=models.CharField(max_length=255, unique=True, db_index=True)
    email=models.EmailField(unique=True, db_index=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=255, blank=False, null=False, default="email")
    is_complete = models.BooleanField(default=False)

    is_2fa_enabled  = models.BooleanField(default=False)
    two_fa_choice = models.CharField(max_length=255, blank=True, choices=TWO_FA_TYPE)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = CustomUserManger()


    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        refresh["username"] = self.username
        refresh["iss"] = "team transcendance"
        refresh["action"] = "login"
        refresh["nonce"] = secrets.token_hex(16)
        refresh["scope"] = "login"
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
