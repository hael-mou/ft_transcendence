from django.http import HttpResponseForbidden
from functools import wraps
from rest_framework_simplejwt.tokens import AccessToken
from ..models import CustomUser

def check_is_complete(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        cookie = request.COOKIES.get('token')
        if not cookie:
            return HttpResponseForbidden("Access denied: no token provided.")
        try:
            token = AccessToken.verify(cookie)
            email = token['sub']
        except Exception:
            return HttpResponseForbidden("Access denied: invalid token provided.")
    
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return HttpResponseForbidden("Access denied: user not found.")

        if not user.is_complete:
            return HttpResponseForbidden("Access denied: incomplete profile.")
        
        return view_func(self, request, *args, **kwargs)

    return _wrapped_view

from functools import wraps
from django.http import HttpResponseForbidden

def is_verified(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        cookie = request.COOKIES.get('token')
        if not cookie:
            return HttpResponseForbidden("Access denied: no token provided.")
        try:
            token = AccessToken(cookie, verify=True)
            email = token.__getitem__('sub')
        except Exception:
            return HttpResponseForbidden("Access denied: invalid token provided.")
    
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return HttpResponseForbidden("Access denied: user not found.")
        
        return view_func(self, request, *args, **kwargs)

    return _wrapped_view