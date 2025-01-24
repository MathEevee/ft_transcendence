from django.db import models
from apps.authe.models import CustomUser

class Game(models.Model):
	GAME_TYPE_CHOICES = [
		('1v1', '1v1'),
		('team', 'Team Battle'),
	]

	type = models.CharField(max_length=50, choices=GAME_TYPE_CHOICES, default='1v1')
	nb_players_required = models.PositiveIntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	started_at = models.DateTimeField(null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f"Game {self.id} ({self.type})"

class Player(models.Model):
	user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
	game = models.ForeignKey(Game, related_name="players", on_delete=models.CASCADE)
	team = models.CharField(max_length=50, null=True, blank=True)
	is_host = models.BooleanField(default=False)
	is_IA = models.BooleanField(default=False)

	def __str__(self):
		return f"Player {self.user.username if self.user else 'IA'} in Game {self.game.id}"
	

