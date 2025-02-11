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
	
class Match(models.Model):
	""" Modèle pour gérer les matchs dans un tournoi. """
	player1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="team1")
	player2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="team2")
	score_team1 = models.PositiveIntegerField(default=0)
	score_team2 = models.PositiveIntegerField(default=0)
	winner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f"Match between {self.player1.username} and {self.player2.username}"
	
	def get_winner(self):
		return self.winner
	
	def set_end(self):
		self.ended_at = now()
		self.save()
	
	def set_winner(self):
		if self.score_team1 > self.score_team2:
			self.winner = self.player1
		elif self.score_team1 < self.score_team2:
			self.winner = self.player2
		else:
			self.winner = None
		self.ended_at = now()
		self.save()
		return self.winner
	
class Tournament(models.Model):
	id = models.AutoField(primary_key=True)
	type_pong = models.BooleanField(default=True)
	players = models.ManyToManyField(CustomUser, through='PlayerEntry', related_name='tournament_players')
	matchlist = models.ManyToManyField(Match, through='MatchEntry', related_name='tournament_matchlist')
	matchmaking = models.BooleanField(default=False)
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
		player_entry = self.player_entries.filter(player=player)
		if not player_entry.exists():
			raise ValueError("Player is not in the tournament.")
		player_entry.delete()

	def add_match(self, player1, player2):
		if self.match_entries.filter(match__player1=player1, match__player2=player2).exists():
			raise ValueError("Match already exists.")
		match = Match.objects.create(player1=player1, player2=player2)
		MatchEntry.objects.create(tournament=self, match=match)

	def remove_match(self, player1, player2):
		match = self.get_match(player1, player2)
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
	
	def get_match(self, player1, player2):
		return self.match_entries.get(match__player1=player1, match__player2=player2)
	
	def get_player_entry(self, player):
		return self.player_entries.get(player=player)
	
	def get_player_entries(self):
		return self.player_entries.all()
	
	def get_matches(self):
		return  self.match_entries.all()
	
	def get_first_match(self):
		return self.match_entries.first()
	
	def get_winner(self):
		return self.winner
	
	def create_next_match(self, team1, team2):
		self.add_match(team1, team2)
		self.save()

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
	

class MatchEntry(models.Model):
	""" Modèle intermédiaire pour gérer les matchs dans un tournoi. """
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="match_entries")
	match = models.ForeignKey(Match, on_delete=models.CASCADE)
	score_team1 = models.PositiveIntegerField(default=0)
	score_team2 = models.PositiveIntegerField(default=0)
	status = models.CharField(max_length=255, default='pending')

	class Meta:
		unique_together = ('tournament', 'match')  # Un match ne peut être associé qu'une fois à un tournoi.

	def __str__(self):
		return f"Match between {self.match.player1.username} and {self.match.player2.username} in {self.tournament.id}"
	

