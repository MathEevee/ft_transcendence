import json
from django.db import models
from apps.authe.models import CustomUser

class Game(models.Model):
	GAME_TYPE_CHOICES = [
		('Pong 1v1', 'Pong 1v1'),
		('Pong 1v1 IA', 'Pong 1v1 IA'),
		('Pong team', 'Pong team'),
		('Space 1v1', 'Space 1v1'),
	]

	type = models.CharField(max_length=50, choices=GAME_TYPE_CHOICES, default='1v1')
	nb_players_required = models.PositiveIntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	started_at = models.DateTimeField(null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)
	tournament = models.BooleanField(default=False)


	def __str__(self):
		return f"Game {self.id} ({self.type})"

	def json(self):
		return {
			'id': self.id,
			'type': self.type,
			'nb_players_required': self.nb_players_required,
			'created_at': self.created_at,
			'started_at': self.started_at,
			'ended_at': self.ended_at,
			'tournament': self.tournament,
		}
	


class Player(models.Model):
	user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
	game = models.ForeignKey(Game, related_name="players", on_delete=models.CASCADE)
	team = models.CharField(max_length=50, null=True, blank=True)
	is_host = models.BooleanField(default=False)
	is_IA = models.BooleanField(default=False)
	score = models.IntegerField(default=0)

	def __str__(self):
		return f"Player {self.user.username if self.user else 'IA'} in Game {self.game.id}"
	
	def json(self):
		return {
			'user': str(self.user),
			'game': self.game.json(),
			'team': self.team,
			'is_host': self.is_host,
			'is_IA': self.is_IA,
			'score': self.score,
		}
	

# class GameStats(models.Model):
	# game = models.ForeignKey(Game, on_delete=models.CASCADE, unique=True)