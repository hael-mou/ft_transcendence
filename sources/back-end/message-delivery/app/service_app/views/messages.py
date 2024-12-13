
from ..components.Message import Message, MessageSerializer
from ..views.authentication import AuthenticationWithID
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics
from ..components.Chat import Chat


from rest_framework.pagination import PageNumberPagination
from urllib.parse import urlparse, urlunparse

# **************************************************************************** #
#   * Custom Pagination :                                                      #
# **************************************************************************** #
class CustomPagination(PageNumberPagination):

    # === get next link : ==================================================== #
    def get_next_link(self):
        """
        Override to include subdomain and scheme in the next URL.
        """
        if not self.page.has_next():
            return None

        url = super().get_next_link()
        if url:
            parsed_url = urlparse(url)
            parsed_url = parsed_url._replace(scheme='https')
            parsed_url = parsed_url._replace(path="/chat" + parsed_url.path)
            return urlunparse(parsed_url)
        return None


    # === get previous link : ================================================ #
    def get_previous_link(self):
        """
        Override to include subdomain and scheme in the previous URL.
        """
        if not self.page.has_previous():
            return None

        url = super().get_previous_link()
        if url:
            parsed_url = urlparse(url)
            parsed_url = parsed_url._replace(scheme='https')
            parsed_url = parsed_url._replace(path="/chat" + parsed_url.path)
            return urlunparse(parsed_url)
        return None



# **************************************************************************** #
#   * Message View :                                                           #
# **************************************************************************** #
class MessageView(generics.ListAPIView):
    authentication_classes = [AuthenticationWithID]
    serializer_class = MessageSerializer
    pagination_class = CustomPagination

    # === get QuerySet : ===================================================== #
    def get_queryset(self):
        self.room_id = self.request.query_params.get('room')
        return Message.objects.filter(chat_id=self.room_id).order_by('-sent_at')


    # === filter QuerySet : ================================================== #
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

    # === check permissions : ================================================ #
    def check_permissions(self, request):

        if not self.request.user or not isinstance(self.request.user, dict):
            raise PermissionDenied("Authentication required.")

        try:
            self.room_id = self.request.query_params.get('room')
            room = Chat.objects.get(id=self.room_id)

        except Chat.DoesNotExist:
            raise PermissionDenied("Room does not exist.")

        user_id = self.request.user['id']
        user1 = room.user1
        user2 = room.user2

        if user_id != user1 and user_id != user2:
            raise PermissionDenied("You do not have permission to access this chat room.")

        super().check_permissions(request)


# **************************************************************************** #
#   * Unread Message View :                                                    #
# **************************************************************************** #
class UnreadMessage(MessageView):

    pagination_class = None

    # === get QuerySet : ===================================================== #
    def get_queryset(self):
        self.room_id = self.request.query_params.get('room')
        return Message.objects.filter(chat__id=self.room_id).exclude(
                        status=Message.Status.READ).order_by('-sent_at')
