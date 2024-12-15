from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from ..models import Tournament
from ..serializers import TournamentSerializer, NewTournamentSerializer, JoinTournamentSerializer
from .authentication import AuthenticationWithID
from rest_framework.response import Response
from rest_framework import status
from ..models import Player
from rest_framework.views import APIView
from service_app.views.utils import Utils

class Tournaments(ListAPIView):
    authentication_classes = [AuthenticationWithID]
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


class CreateNewTournament(CreateAPIView):
    authentication_classes = [AuthenticationWithID]
    serializer_class = NewTournamentSerializer

    def post(self, request):
        player_id = request.user.id
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(player_id=player_id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LeaveTournament(APIView):
    authentication_classes = [AuthenticationWithID]

    def get(self, request, *args, **kwargs):
        player_id = request.user.id
        player = Player.objects.filter(id=player_id).first()
        tournament = player.tournament
        if not tournament:
            return Response(status=status.HTTP_204_NO_CONTENT)
        tournament.n_players -= 1
        print(tournament.n_players)
        if tournament.n_players == 0:
            tournament.delete()
        player.tournament = None
        player.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class JoinTournament(APIView):
    authentication_classes = [AuthenticationWithID]
    queryset = Tournament.objects.all()
    serializer_class = JoinTournamentSerializer

    
    def post(self, request, *args, **kwargs):
        player_id = request.user.id
        serializer = self.serializer_class(data={"player_id": player_id, "tournament_id": request.data["tournament_id"]})
        serializer.is_valid(raise_exception=True)
        tournament = serializer.save(player_id=player_id)
        if tournament.n_players == tournament.max_players:
            data =  Utils.create_matches(tournament.id)
            return Response(data, status=status.HTTP_201_CREATED)
        return Response("{message: 'Joined tournament'}", status=status.HTTP_201_CREATED)


class MyTournament(APIView):
    authentication_classes = [AuthenticationWithID]

    def get(self, request, *args, **kwargs):
        player_id = request.user.id
        player = Player.objects.filter(id=player_id).first()
        if not player:
            return Response(status=status.HTTP_204_NO_CONTENT)
        if player.tournament == None:
            return Response({"message": "No tournament"}, status=status.HTTP_204_NO_CONTENT)
        tournament = player.tournament
        n_players = tournament.n_players
        return Response({"tournament": player.tournament.id, "n_players": n_players}, status=status.HTTP_200_OK)