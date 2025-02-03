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
	
	def set_online(self):
		self.is_online = True
		self.save()

	def set_offline(self):
		self.is_online = False
		self.save()

	def set_last_login(self):
		self.last_login = now()
		self.save()

	def set_profil_picture(self, picture):
		self.profil_picture = picture
		self.save()

	def set_email(self, email):
		self.email = email
		self.save()

	def get_profil_picture(self):
		return self.profil_picture
	
	def get_intra_id(self):
		return self.intra_id
	
	def get_email(self):
		return self.email
	
	def get_username(self):
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
	matchmaking = models.BooleanField(default=False)
	matchlist = models.JSONField(null=True, blank=True)
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

	def remove_player(self, player):
		entry = self.get_player_entry(player)
		entry.delete()

	def add_match(self, team1, team2):
		if self.matches.count() >= 4:
			raise ValueError("Tournament is already full.")
		Match.objects.create(tournament=self, team1=team1, team2=team2)

	def remove_match(self, team1, team2):
		match = self.get_match(team1, team2)
		match.delete()

	def start(self):
		if self.players.count() < 8:
			raise ValueError("Tournament is not full.")
		self.started = True
		self.started_at = now()
		self.save()

	def end(self):
		if not self.started:
			raise ValueError("Tournament hasn't started yet.")
		self.ended_at = now()
		self.save()

	def set_winner(self, player):
		self.winner = player
		self.end()
		self.save()
		return self.winner
	
	def get_match(self, team1, team2):
		return self.matches.get(team1=team1, team2=team2)
	
	def get_player_entry(self, player):
		return self.player_entries.get(player=player)
	
	def get_player_entries(self):
		return self.player_entries.all()
	
	def get_matches(self):
		return self.matches.all()

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
	

class Match(models.Model):
	""" Modèle pour gérer les matchs dans un tournoi. """
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches")
	player1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="team1")
	player2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="team2")
	score_team1 = models.PositiveIntegerField(default=0)
	score_team2 = models.PositiveIntegerField(default=0)
	winner = models.ForeignKey(PlayerEntry, on_delete=models.SET_NULL, related_name="winner", null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f"Match between {self.team1.player.username} and {self.team2.player.username} in tournament {self.tournament.id}"
	
	def set_winner(self):
		if self.score_team1 > self.score_team2:
			self.winner = self.team1
		elif self.score_team2 > self.score_team1:
			self.winner = self.team2
		else:
			raise ValueError("Match can't have a draw.")
		self.ended_at = now()
		self.save()
		return self.winner