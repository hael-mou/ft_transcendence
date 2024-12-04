from rest_framework import status, generics
from rest_framework.response import Response
from ..models import FriendShipRequest, Profile
from ..serializers.friends import FriendShipSerializer, AcceptFriendSerializer, RejectSerializer
from ..serializers.friends import CancelSerializer, RemoveFriendSerializer
from django.db.models import Q
from .authentication import AuthenticationWithID

class FriendsRequestManager(generics.GenericAPIView):

    serializer_class = FriendShipSerializer
    authentication_classes = [AuthenticationWithID]

    def get_queryset(self):
        self.queryset = FriendShipRequest.objects.filter(
                Q(sender_profile=self.request.user) | Q(receiver_profile=self.request.user)
        )
        return super().get_queryset()

    def get(self, request):
        query_params = request.query_params
        friend_requests = self.get_queryset()

        filters = {}
        for key, value in query_params.items():
            if key in ("received", "sent"):
                key = "sender_profile" if key == "sent" else "receiver_profile"
                filters[f"{key}"] = self.request.user
            elif key in ("pending", "accepted", "rejected"):
                filters["status"] = {"pending": 0, "accepted": 1, "rejected": 2}[key]

        friend_requests = self.get_queryset().filter(**filters)

        serialized_data = self.get_serializer(friend_requests, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message": "Friend request sent"},
                         status=status.HTTP_201_CREATED)


class AcceptFriendRequest(generics.CreateAPIView):

    queryset = FriendShipRequest.objects.all()
    serializer_class = AcceptFriendSerializer
    authentication_classes = [AuthenticationWithID]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()


class RejectFriendRequest(generics.UpdateAPIView):

    queryset = FriendShipRequest.objects.all()
    serializer_class = RejectSerializer
    authentication_classes = [AuthenticationWithID]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.validated_data
        instance.delete()
        return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)


class CancelFriendRequest(generics.DestroyAPIView):

    queryset = FriendShipRequest.objects.all()
    serializer_class = CancelSerializer
    authentication_classes = [AuthenticationWithID]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.validated_data
        self.perform_destroy(instance)
        return Response({"message": "Friend request canceled"}, status=status.HTTP_200_OK)

class RemoveFriend(generics.GenericAPIView):

    queryset = Profile.objects.all()
    serializer_class = RemoveFriendSerializer
    authentication_classes = [AuthenticationWithID]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = data['user']
        friend_id = data['friend']
        friend = Profile.objects.filter(id=friend_id).first()
        friend.friends.remove(user.id)
        user.friends.remove(friend_id)
        return Response({"message": "Friend removed"}, status=status.HTTP_200_OK)
