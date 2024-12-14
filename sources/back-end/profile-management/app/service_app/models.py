from enum import Enum 
from django.db import models
from django.conf import settings

class Profile(models.Model):
    last_name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    username = models.CharField(unique=True, max_length=100)
    friends = models.ManyToManyField("self", blank=True)
   

    def add_friend(self, other_profile):
        """
        Adds a friendship between this profile and another.
        Avoids duplicates by ensuring `self` is added only if not already a friend.
        """
        if other_profile != self and not self.friends.filter(id=other_profile.id).exists():
            self.friends.add(other_profile)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"
    


class Match(models.Model):
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="winner")
    loser = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="loser")
    date = models.DateField(auto_now_add=True)
    winnerScore = models.IntegerField()
    loserScore = models.IntegerField()

    def __str__(self):
        return f"{self.winner} vs {self.loser}"

class FriendShipRequest(models.Model):

    STATUS_CHOICES = [
        (0, 'Pending'),
        (1, 'Accepted'),
        (2, 'Declined'),
    ]

    sender_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="sender")
    receiver_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="receiver")
    status = models.IntegerField(default=0, choices=STATUS_CHOICES)
    # to see later what about time if we add them or not 

    def get_status_display(self):
        return self.STATUS_CHOICES[self.status][1]

    def __str__(self):
        return f"{self.sender_profile} -> {self.receiver_profile} : {self.get_status_display()}"
