from django.db import models
from apps.authe.models import Tournament, MatchEntry, PlayerEntry
from apps.authe.models import CustomUser

# Create your models here.

class HistoryTournaments(models.Model):
    match = models.ForeignKey(MatchEntry, on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)

    def __str__(self):
        return self.tournament.name + ' - ' + self.user.username