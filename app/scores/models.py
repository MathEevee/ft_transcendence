from django.db import models

class PlayerStats(models.Model):
    username = models.CharField(max_length=150, unique=True)
    games_play = models.PositiveIntegerField(default=0)
    games_win = models.PositiveIntegerField(default=0)
    total_score = models.IntegerField(default=0)

    def __str__(self):
        return self.username
