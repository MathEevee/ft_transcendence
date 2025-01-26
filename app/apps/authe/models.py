from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

class CustomUser(AbstractUser):
	intra_id = models.CharField(max_length=255, null=True, blank=True, unique=True) # accept NULL for register.html
	email = models.EmailField(unique=True)
	profil_picture = models.CharField(max_length=255, null=True, blank=True)
	is_online = models.BooleanField(default=False)
	last_login = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return self.username

class Message(models.Model):
	author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recipient')

	def __str__(self):
		return f"Message from {self.author.username}"
	
class Tournament(models.Model):
	id = models.AutoField(primary_key=True)
	type_pong = models.BooleanField(default=True)
	players = models.ManyToManyField(CustomUser, through='PlayerEntry', related_name='tournament_players')
	status = models.CharField(max_length=255, default='pending')
	started = models.BooleanField(default=False)
	created_at = models.DateTimeField(default=now)
	started_at = models.DateTimeField(null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)
	winner = models.ForeignKey(CustomUser, related_name='tournament_winner', on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return f"Tournament #{self.id} , type_pong = {self.type_pong}"
	
	def add_player(self, player, team_name=None):
		if self.players.count() >= 8:
			raise ValueError("Tournament is already full.")
		PlayerEntry.objects.create(tournament=self, player=player, team_name=team_name)

class PlayerEntry(models.Model):
	""" Modèle intermédiaire pour gérer les joueurs et noms d'équipe dans un tournoi. """
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="player_entries")
	player = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	team_name = models.CharField(max_length=255, null=True, blank=True)
	is_host = models.BooleanField(default=False)

	class Meta:
		unique_together = ('tournament', 'player')  # Un joueur ne peut être associé qu'une fois à un tournoi.

	def __str__(self):
		return f"{self.player.username} in {self.tournament.id} (Team: {self.team_name or 'N/A'})"