
from django.urls import path
from .consumer import AsyncChatConsumer

websocket_urlpatterns = [
    path('ws/', AsyncChatConsumer.as_asgi())
]
