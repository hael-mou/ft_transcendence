from rest_framework import status, generics
from rest_framework.response import Response
from ..models import Match
from ..serializers.mathes import MatchSerializer
from django.db.models import Q
from .authentication import AuthenticationWithID

class Matches(generics.ListAPIView, generics.CreateAPIView):

    """Class for matches to get list of mathces and add new matches"""
    serializer_class = MatchSerializer
    authentication_classes = [AuthenticationWithID]

    def get_queryset(self):
        return Match.objects.all().order_by('date')

    def get(self, request):
        query_params = request.query_params
        id = query_params.get('id', request.user.id)
        matches = self.get_queryset().filter(Q(winner=id) | Q(loser=id))

        filters = {}
        for key, value in query_params.items():
            if key in ("winner", "loser"):
                filters[key] = self.request.user
            elif key == "date":
                filters["date"] = value

        matches = matches.filter(**filters)
        grouped_matches = {}
        serialized_data = self.get_serializer(matches, many=True).data
        for match in serialized_data:
            match_date, match_data = match
            if match_date not in grouped_matches:
                grouped_matches[match_date] = []
            grouped_matches[match_date].append(match_data)
        return Response(grouped_matches, status=status.HTTP_200_OK)


    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message": "Match added"},
                         status=status.HTTP_201_CREATED)
