import time
from ..models import Match
from ..models import Player
from rest_framework import status
from datetime import time as daate
from rest_framework.views import APIView
from service_app.views.utils import Utils
from rest_framework.response import Response
from ..models import Match, Player, Tournament
from .authentication import AuthenticationWithID

class MatchResult(APIView):
    authentication_classes = [AuthenticationWithID]

    def post(self, request):
        winner_score = request.data['winner_score']
        loser_score = request.data['loser_score']
        winner_id = request.data['winner_id']
        loser_id = request.data['loser_id']

        player1 = Player.objects.filter(id=winner_id).first()
        player2 = Player.objects.filter(id=loser_id).first()
        match = Match.objects.filter(player1=player1, player2=player2).first()
        match.winner = player1
        match.scores = f"{winner_score}:{loser_score}"
        match.save()
        tournament = match.tournament

        match = Match.objects.filter(tournament=tournament)
        if len(match) == 2 and match[0].winner != None and match[1].winner != None:
            final_match = Match.objects.create(
                player1=match[0].winner,
                player2=match[1].winner,
                time=daate(hour=0, minute=6),
                room_id=f"{match[0].winner.id}{match[1].winner.id}-{int(time.time())}",
                scores='',
                tournament=tournament
            )
            return Response({"message": "final match", "final_match": final_match}, status=status.HTTP_201_CREATED)
        return Response({"message": "match updated"}, status=status.HTTP_201_CREATED)