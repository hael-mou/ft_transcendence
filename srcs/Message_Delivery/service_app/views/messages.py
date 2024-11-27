
from rest_framework import generics
from ..components.Message import Message, MessageSerializer

class MessageView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = MessageSerializer
    room_id = 0
    def get_queryset(self):
        self.room_id = self.request.query_params.get('room')
        return Message.objects.filter(chat_id=self.room_id).order_by('-sent_at')

    def filter_queryset(self, queryset):
        filters = {}
        query_params = self.request.query_params
        for key, value in query_params.items():
            if hasattr(Message, key):
                filters[key] = value
            elif key == 'start_id':
                filters['id__gt'] = value
        queryset = queryset.filter(**filters)
        return queryset

class UnreadMessage(MessageView):

    pagination_class = None
    def get_queryset(self):
        self.room_id = self.request.query_params.get('room')
        return Message.objects.filter(chat__id=self.room_id).exclude(
                        status=Message.Status.READ).order_by('-sent_at')
