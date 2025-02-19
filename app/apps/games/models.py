import json
from django.db import models
from django.core.validators import MaxLengthValidator, MinValueValidator, MaxValueValidator
from apps.authe.models import CustomUser

class Game(models.Model):
	GAME_TYPE_CHOICES = [
		('Pong 1v1', 'Pong 1v1'),
		('Pong 1v1 IA', 'Pong 1v1 IA'),
		('Pong multi', 'Pong multi'),
		('Space 1v1', 'Space 1v1'),
	]

	type = models.CharField(max_length=50, choices=GAME_TYPE_CHOICES, default='Pong 1v1')
	nb_players_required = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
	created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
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
			'created_at': self.created_at.isoformat() if self.created_at else None,
			'started_at': self.started_at.isoformat() if self.started_at else None,
			'ended_at': self.ended_at.isoformat() if self.ended_at else None,
			'tournament': self.tournament,
		}
	


class Player(models.Model):
	user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
	game = models.ForeignKey(Game, related_name="players", on_delete=models.CASCADE)
	team = models.CharField(max_length=50, null=True, blank=True, validators=[MaxLengthValidator(50)])
	is_host = models.BooleanField(default=False)
	is_IA = models.BooleanField(default=False)
	score = models.IntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(1000)])

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