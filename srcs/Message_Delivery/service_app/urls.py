
from django.urls import path

from service_app.views.rooms import Rooms
from service_app.views.messages import MessageView, UnreadMessage

urlpatterns = [
    path("get_rooms/", Rooms.as_view(), name="get_rooms"),
    path("get_messages/", MessageView.as_view(), name="get_messages"),
    path("unread_messages/", UnreadMessage.as_view(), name="unread_messages"),
]
