from django.urls import path
from .views.google_view import GoogleSocialAuthCallback,  GoogleOAuth2Registrer
from .views.intra_view import Intra42AuthCallbackView, Intra42AuthView

urlpatterns = [
    path('google', GoogleOAuth2Registrer.as_view(), name="google_register"),
    path('google/callback', GoogleSocialAuthCallback.as_view(), name="google-callback"),

    path('42', Intra42AuthView.as_view(), name="42_register"),
    path('42/callback', Intra42AuthCallbackView.as_view(), name="42-callback"),
]
