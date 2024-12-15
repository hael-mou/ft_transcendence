from rest_framework import serializers
from service_app.models import Tournament, Player, Match

# =====Player Serialzer: =======================================================
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "tournament"]

# =====Match Serialzer: =========================================================
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["id", "player1", "player2", "time", "scores, max_players", "winner"]


# =====Tournament Serialzer: ======================================================
class TournamentSerializer(serializers.ModelSerializer):
    """Serializer for the tournament model.
    """
    # matches = MatchSerializer(many=True)
    players = PlayerSerializer(many=True)

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'players', 'n_players', 'matches']

    def to_representation(self, instance):
        # matches = Match.objects.filter(tournament=instance)
        players = Player.objects.filter(tournament=instance)
        players = [player.id for player in players]
        return {
            "name": instance.name,
            "players": players,
            "n_players": instance.n_players,
            # "matches": matches
            "id": instance.id
        }


class NewTournamentSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=200)

    def validate(self, attrs):
        player_id = self.context['request'].user.id
        if not player_id:
            raise serializers.ValidationError({"error": "User not found"})
        player = Player.objects.filter(id=player_id).first()
        if player.tournament != None:
            raise serializers.ValidationError({"error": "User is already in a tournament"})
        return {'player': player, 'name': attrs['name']}
    
    def create(self, validated_data):
        player = validated_data['player']
        tournament = Tournament.objects.create(name=validated_data['name'], n_players=1)
        player.tournament = tournament
        player.save()
        return tournament



class JoinTournamentSerializer(serializers.Serializer):
    tournament_id = serializers.IntegerField(required=True)
    player_id = serializers.IntegerField(required=True)

    def validate(self, attrs):
        player_id = attrs["player_id"]
        tournament_id = attrs["tournament_id"]
        if not player_id:
            raise serializers.ValidationError({"error": "User not found"})
        player = Player.objects.filter(id=player_id).first()
        if player.tournament != None:
            raise serializers.ValidationError({"error": "User is already in a tournament"})
        tournament = Tournament.objects.filter(id=tournament_id).first()
        if tournament == None:
            raise serializers.ValidationError({"error": "Tournament not found"})
        if tournament.n_players == tournament.max_players:
            raise serializers.ValidationError({"error": "Tournament is full"})
        return {'player': player, 'tournament': tournament}
    
    def create(self, validated_data):
        player = validated_data['player']
        tournament = validated_data['tournament']
        player.tournament = tournament
        player.save()
        tournament.n_players += 1
        tournament.save()
        return tournament