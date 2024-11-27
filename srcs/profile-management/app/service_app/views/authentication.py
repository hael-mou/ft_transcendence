from rest_framework import generics
from service_app.models import Profile
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission


class AuthenticationWithID(BaseAuthentication):
    """class for authenticated users to get user id"""

    def authenticate(self, request, *args, **kwargs):
        return (Profile.objects.get(id=1), None)
    

class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return True