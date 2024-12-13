
from rest_framework.exceptions import PermissionDenied
from .authentication import AuthenticationWithID
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from ..components.Chat import Chat
from rest_framework import status
from django.db.models import Q

# **************************************************************************** #
#   * Chat Serializer :                                                        #
# **************************************************************************** #
class ChatSerializer(serializers.Serializer):
    class Meta:
        model = Chat
        fields = ('id', 'user1', 'user2')
        read_only_fields = ('blocked_by',)

    def to_representation(self, instance):
        user_id = self.context['user']['id']
        peer_id = instance.user2 if user_id == instance.user1 else instance.user1
        return {
            "id": instance.id,
            "peer": peer_id,
            "blocked_by": instance.blocked_by
        }


# **************************************************************************** #
#   * Rooms View :                                                             #
# **************************************************************************** #
class Rooms(APIView):
    authentication_classes = [AuthenticationWithID]
    serializer_class = ChatSerializer


    def get(self, request, *args, **kwargs):
        user = request._user
        rooms = Chat.objects.filter(Q(user1=user['id']) | Q(user2=user['id']))
        serializer = self.serializer_class(rooms, many=True, context={'user': user})
        return Response(serializer.data, status=status.HTTP_200_OK)


# **************************************************************************** #
#   * Block Rooms View :                                                       #
# **************************************************************************** #
class BlockRoomsView(APIView):
    authentication_classes = [AuthenticationWithID]


    def post(self, request):
        user_id = request._user['id']
        room_id = request.data.get('room')
        action  = request.data.get('action')

        if room_id is None or action is None:
            raise PermissionDenied("Missing room or action.")

        room = get_object_or_404(Chat, id=room_id)

        if room.user1 != user_id and room.user2 != user_id:
            raise PermissionDenied("You do not have permission to access this chat room.")


        if action == 'block':
            self._block_room(user_id, room)
        elif action == 'unblock':
            self._unblock_room(user_id, room)
        else:
            raise PermissionDenied("Invalid action.")

        return Response({"message": f"Room {action} successfully"}, status=status.HTTP_200_OK)


    def _block_room(self, user_id, room):
        if room.blocked_by is not None:
            raise PermissionDenied("Room is already blocked.")

        room.blocked_by = user_id
        room.save()


    def _unblock_room(self, user_id, room):
        if room.blocked_by is None:
            return

        if room.blocked_by != user_id:
            raise PermissionDenied("You do not have permission to unblock this chat room.")

        room.blocked_by = None
        room.save()
