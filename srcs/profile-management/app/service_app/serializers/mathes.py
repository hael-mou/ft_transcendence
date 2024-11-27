from rest_framework import serializers
from ..models import Match, Profile
from ..serializers.profile import ProfileSerializer

class MatchSerializer(serializers.ModelSerializer):
    opponent = ProfileSerializer(read_only=True)

    winner= serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), write_only=True)
    loser= serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), write_only=True)
    scores = serializers.CharField(read_only=True)

    class Meta:
        model = Match
        fields = ['opponent', 'date', 'scores', 'winner', 'loser', 'winnerScore', 'loserScore']

    def to_representation(self, instance):
        """
        This method wiil format the opponent and scores
        """

        players = [instance.winner, instance.loser]
        me = self.context["request"].user

        if me is instance.winner:
            opponent = instance.loser
        else:
            opponent = instance.winner

        representation = super().to_representation(instance)
        representation['opponent'] = ProfileSerializer(opponent).data
        representation["scores"] = f"{instance.winnerScore}:{instance.loserScore}"
        representation["status"] = "win" if instance.winner == me else "lose"
        
        date = representation.pop('date')

        # match_date = instance.date.date()
        return (date, representation)