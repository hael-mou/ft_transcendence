from ..models import Profile
from django.db.models import Q
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..serializers.profile import ProfileSerializer
from django_filters.rest_framework import DjangoFilterBackend
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
        search_query = query_params.get('search', None)

        if search_query:
            search_filter = Q(username__icontains=search_query) | Q(first_name__icontains=search_query) | Q(last_name__icontains=search_query)
            queryset = queryset.filter(search_filter)

        for key, value in query_params.items():
            if hasattr(Profile, key) and key != 'search':
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
        updatable_fields = ["avatar", "username", "last_name", "first_name"]

        for field in updatable_fields:
            new_value = request_data.get(field, None)
            if new_value not in [None, ""]:
                setattr(user, field, new_value)
        try:
            user.save()
        except Exception as e:
            return Response({"error": f"Profile update failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Profile updated"}, status=status.HTTP_200_OK)
