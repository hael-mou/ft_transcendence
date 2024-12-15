from ..models import Profile
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers.profile import ProfileSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from .authentication import AuthenticationWithID


#########################CRUD OPERATIONS#####################################
class Profiles(ListAPIView):

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [AuthenticationWithID]

    def get_queryset(self):
        queryset = super().get_queryset()
        query_params = self.request.query_params

        for key, value in query_params.items():
            if hasattr(Profile, key):
                filter_kwargs = {key: value}
                queryset = queryset.filter(**filter_kwargs)

        return queryset


########################## My Profile ##########################
class MyProfile(CreateAPIView, RetrieveUpdateDestroyAPIView):
    """
    crud operation of profile of authenticated user
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [AuthenticationWithID]

    def get(self, request, *args, **kwargs):
        """Retrieve the authenticated user's profile."""
        query_params = request.query_params
        instance = self.get_object()

        fields_to_retrieve = {
            key: getattr(instance, key) for key in query_params.keys() if hasattr(instance, key)
        }
        if "friends" in fields_to_retrieve:
            friends_queryset = self.queryset.filter(friends=instance)
            friends_serializer = ProfileSerializer(friends_queryset, many=True)
            fields_to_retrieve["friends"] = friends_serializer.data

        if fields_to_retrieve:
            return Response(fields_to_retrieve, status=status.HTTP_200_OK)

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        return get_object_or_404(Profile, id=self.request.user.id)


    def perform_destroy(self, instance):
        instance.delete()
        # not tested yet
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, *args, **kwargs):
        """Update the authenticated user's profile partially."""
        kwargs["partial"] = True
        user = request.user
        request_data = request.data

        try:
            if 'avatar' in request.FILES:
                avatar_file = request.FILES['avatar']
                user.avatar = avatar_file
                import sys
                print(user.avatar, avatar_file, file=sys.stderr)

            for field in ["username", "last_name", "first_name"]:
                request_data.setdefault(field, getattr(user, field))
                setattr(user, field, request_data[field])
            user.save()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)
