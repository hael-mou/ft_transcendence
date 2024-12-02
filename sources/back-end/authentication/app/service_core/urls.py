
from django.urls import path, include

urlpatterns = [
    path('', include('authentication_app.urls')),
    path('social_auth/', include('social_authentication.urls')),
]
