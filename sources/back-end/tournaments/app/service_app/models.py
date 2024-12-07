from django.db import models


class Player(models.Model):
    id = models.IntegerField(primary_key=True)
    tournament = models.ForeignKey('Tournament',
                                related_name='players',
                                on_delete=models.CASCADE,
                                null = True)
    def __str__(self):
        return self.id

class Match(models.Model):
    player1 = models.ForeignKey('Player',
                                on_delete=models.CASCADE,
                                related_name='player1')
    player2 = models.ForeignKey('Player',
                                on_delete=models.CASCADE,
                                related_name='player2')
    time = models.TimeField()
    scores = models.CharField(max_length=200)
    def __str__(self):
        return f"Match: {self.player1} vs {self.player2}"

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    max_players = models.IntegerField(default=4)
    n_players = models.IntegerField(default=1)


    def __str__(self):
        return self.name