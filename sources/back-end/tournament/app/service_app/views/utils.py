import time
from ..models import Match, Player, Tournament
import random
from datetime import time as daate

class Utils:
    @staticmethod
    def create_matches(tournament_id):
        tournament = Tournament.objects.get(id=tournament_id)
        players = list(Player.objects.filter(tournament=tournament))

        # Shuffle players
        random.shuffle(players)

        # Semi-final match creation
        match1 = Match.objects.create(
            player1=players[0],
            player2=players[1],
            time=daate(hour=0, minute=2),
            room_id=f"{players[0].id}{players[1].id}-{int(time.time())}",
            scores='',
            tournament=tournament
        )

        match2 = Match.objects.create(
            player1=players[2],
            player2=players[3],
            time=daate(hour=0, minute=4),
            room_id=f"{players[2].id}{players[3].id}-{int(time.time())}",
            scores='',
            tournament=tournament
        )
        return ({"message": "start tournament", match1: match1, match2:match2})
