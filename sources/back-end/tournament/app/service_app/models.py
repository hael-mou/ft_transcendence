from django.db import models

# === Players : ==========================================================
class Player(models.Model):
    id = models.IntegerField(primary_key=True)
    tournament = models.ForeignKey('Tournament', related_name='players',
                        on_delete=models.CASCADE, null = True)
    def __str__(self):
        return self.id

# === Matches : ==========================================================
class Match(models.Model):
    player1 = models.ForeignKey('Player', on_delete=models.CASCADE,
                        related_name='player1')
    player2 = models.ForeignKey('Player', on_delete=models.CASCADE,
                                related_name='player2')
    room_id = models.CharField(max_length=200)
    time = models.TimeField(auto_now_add=True)
    scores = models.CharField(max_length=200)
    tournament = models.ForeignKey('Tournament', related_name='matches',
                        on_delete=models.CASCADE)
    winner = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='winner', default=None, null=True)
    def __str__(self):
        return f"Match: {self.player1.id} vs {self.player2.id}"

# === Tournament : =======================================================
class Tournament(models.Model):
    name = models.CharField(max_length=200)
    max_players = models.IntegerField(default=1)
    n_players = models.IntegerField(default=1)


    def __str__(self):
        return self.name
