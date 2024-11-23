from rest_framework import serializers
from rest_framework import generics
from ..components.Chat import Chat
from django.db.models import Q

class ChatSerializer(serializers.Serializer):
    class Meta:
        model = Chat
        fields = ('id', 'user1', 'user2')

    def to_representation(self, instance):
        user_id = self.context["id"]
        peer_id = instance.user2 if user_id == instance.user1 else instance.user1
        return {
            "id": instance.id,
            "peer": peer_id
        }


class Rooms(generics.ListAPIView, generics.RetrieveAPIView):
    permission_classes = []             # To be set for authenticated user access
    authentication_classes = []         # To be set for authentication
    serializer_class = ChatSerializer
    user_id = 0

    def filter_queryset(self, queryset):
        query_params = self.request.query_params
        peer_id = self.request.query_params.get('peer_id')
        peer_id = query_params.get('peer_id')
        if peer_id:
            queryset = queryset.filter(Q(user1=peer_id) | Q(user2=peer_id))
        return queryset

    def get_serializer(self, *args, **kwargs):
        serializer_context = {'id': self.user_id}
        return self.serializer_class(*args, **kwargs, context=serializer_context)
    
    def get_queryset(self):
        query_params = self.request.query_params
        self.user_id = str(query_params.get('id'))
        return Chat.objects.filter(Q(user1=self.user_id) | Q(user2=self.user_id))
