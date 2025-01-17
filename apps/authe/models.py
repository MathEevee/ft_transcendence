from django.contrib.auth.models import AbstractUser
from django.db import models

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
	players = models.ManyToManyField(CustomUser, related_name='tournament_players')
	teamname = models.CharField(max_length=255, null=True, blank=True)
	status = models.CharField(max_length=255, default='pending')
	started = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	started_at = models.DateTimeField(null=True, blank=True)
	ended_at = models.DateTimeField(null=True, blank=True)
	winner = models.ForeignKey(CustomUser, related_name='tournament_winner', on_delete=models.CASCADE, null=True, blank=True)

	def __str__(self):
		return f"Tournament Pong : {self.status}"
	
