
from django.urls import path

from service_app.views.rooms import Rooms, BlockRoomsView
from service_app.views.messages import MessageView, UnreadMessage
from service_app.views.Connection import ConnectionView

urlpatterns = [
    path("get_rooms/", Rooms.as_view(), name="get_rooms"),
    path("block_rooms/", BlockRoomsView.as_view(), name="block_rooms"),
    path("get_messages/", MessageView.as_view(), name="get_messages"),
    path("unread_messages/", UnreadMessage.as_view(), name="unread_messages"),
    path("isConnected/", ConnectionView.as_view(), name="isConnected"),
]
