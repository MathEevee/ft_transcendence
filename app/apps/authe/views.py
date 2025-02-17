import requests
import logging
import os
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse, reverse_lazy
from django.conf import settings
from django.utils.timezone import now
from django.db.utils import IntegrityError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from .models import CustomUser, Message, Tournament, PlayerEntry, Match, MatchEntry
from .forms import RegistrationForm, LoginForm, UserSettingsForm
from .serializer import CustomUserSerializer, TournamentSerializer, MatchSerializer
from random import randint
from django.db.models import Count
from .decorators import logout_required

logger = logging.getLogger(__name__)

@logout_required
def auth_with_42(request):
	client_id = settings.OAUTH_UID
	# redirect_uri = '<VOTRE_REDIRECT_URI>'
	redirect_uri = request.build_absolute_uri(reverse('authe:auth_callback'))
	tmpsplit = redirect_uri.split('/')
	tmpsplit[0] = 'https:'
	redirect_uri = '/'.join(tmpsplit)
	print("\033[1;32mredirect_uri: ", redirect_uri, "\033[0m")
	scope = 'public'  # Demande d'accès aux informations publiques de l'utilisateur
	auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}'
	return redirect(auth_url)

@logout_required
def auth_callback(request):
	# Récupérer le code renvoyé par l'intra
	code = request.GET.get('code')
	if not code:
		messages.error(request, "Code d'autorisation manquant.")
		return redirect('/')  # Rediriger vers page home
	redirect_uri = request.build_absolute_uri(reverse('authe:auth_callback'))
	tmpsplit = redirect_uri.split('/')
	tmpsplit[0] = 'https:'
	redirect_uri = '/'.join(tmpsplit)
	print("\033[1;32mredirect_uri: ", redirect_uri, "\033[0m")

	# Préparer la requête pour obtenir un token
	token_url = 'https://api.intra.42.fr/oauth/token'
	data = {
		'grant_type': 'authorization_code',
		'client_id': settings.OAUTH_UID,
		'client_secret': settings.OAUTH_SECRET,
		'code': code,
		'redirect_uri': redirect_uri,
	}
	
	# Envoyer la requête pour obtenir un token
	response = requests.post(token_url, data=data)
	if response.status_code != 200:
		messages.error(request, "Authentification failed. Please retry.")
		return redirect('/')
	
	token_data = response.json()
	access_token = token_data.get('access_token')

	# Utiliser le token pour récupérer les informations utilisateur
	user_info_url = 'https://api.intra.42.fr/v2/me'
	user_info = requests.get(
		user_info_url,
		headers={'Authorization': f'Bearer {access_token}'}
	).json()

	if 'id' not in user_info or 'email' not in user_info:
		messages.error(request, "Impossible de récupérer les informations utilisateur.")
		return redirect('/')

	# Sauvegarder ou connecter l'utilisateur ici
	try:
		user = save_user(user_info)
	except IntegrityError:
		messages.error(request, "Impossible de créer ou éditer l'utilisateur.")
		return redirect('/')

	# Connecter l'utilisateur
	login(request, user)
	user.last_login = now()
	user.save()
	messages.success(request, f"Bienvenue, {user.username}!")
	return redirect(reverse('profil:profil', kwargs={'username': user.username}))

def save_user(user_info):
	picture_url = user_info.get('image', {}).get('versions', {}).get('medium', '/static/pictures/user-avatar-01.png')

	# Vérifier si un utilisateur existe déjà par `intra_id`
	user, created = CustomUser.objects.get_or_create(
		intra_id=user_info['id'],
		defaults={
			'username': user_info['login'],
			'email': user_info['email'],
			'profil_picture': picture_url,
		}
	)
	
	if created:
		logger.info(f"Created new user: {user.username}")
	else:
		logger.info(f"Existing user logged in: {user.username}")
		# Mise à jour des informations si nécessaire
		user.email = user_info['email']
		user.profil_picture = picture_url
		user.save()

	return user

@logout_required
def register_view(request):
	if request.method == 'POST':
		form = RegistrationForm(request.POST)
		if form.is_valid():
			user = form.save(commit=False)
			user.profil_picture = request.POST.get('profil_picture', '/static/pictures/user-avatar-01.png')
			user.save()
			messages.success(request, "Inscription réussie ! Connectez-vous.")
			return redirect(reverse('authe:login'))
		else:
			# Ajouter un message avec les erreurs du formulaire
			for field, errors in form.errors.items():
				for error in errors:
					messages.info(request, f"{field.capitalize()}: {error}")

	else:
		form = RegistrationForm()
	
	avatars_dir = os.path.join(settings.BASE_DIR, 'static/pictures/')
	avatars = [f"/static/pictures/{img}" for img in os.listdir(avatars_dir) if img.endswith(('.png', '.jpg', '.jpeg'))]
	
	return render(request, 'register.html', {'form': form, 'avatars': avatars})

@login_required
def settings_view(request):
	if request.method == 'POST':
		form = UserSettingsForm(request.POST, instance=request.user)
		if form.is_valid():
			user = form.save(commit=False)
			user.profil_picture = request.POST.get('profil_picture', user.profil_picture)
			user.save()
			messages.success(request, "Modifications réussies !")
			return redirect(reverse('profil:profil', kwargs={'username': user.username}))
		else:
			# Ajouter un message avec les erreurs du formulaire
			for field, errors in form.errors.items():
				for error in errors:
					messages.info(request, f"{field.capitalize()}: {error}")
	else:
		form = UserSettingsForm(instance=request.user)

	avatars_dir = os.path.join(settings.BASE_DIR, 'static/pictures/')
	avatars = [f"/static/pictures/{img}" for img in os.listdir(avatars_dir) if img.endswith(('.png', '.jpg', '.jpeg'))]

	return render(request, 'settings.html', {'form': form, 'avatars': avatars, 'selected_avatar': request.user.profil_picture})

class CustomPasswordChangeView(PasswordChangeView):
	template_name = 'password_change.html'
	success_url = reverse_lazy('profil:profil')

	def form_valid(self, form):
		messages.success(self.request, "Passord correctly updating !")
		return super().form_valid(form)

@logout_required
def login_view(request):
	if request.method == 'POST':
		form = LoginForm(request.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			user = authenticate(request, username=username, password=password)
			if user is not None:
				login(request, user)
				messages.success(request, "Connexion réussie !")
				return redirect(reverse('profil:profil', kwargs={'username': username}))
			else:
				messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
	else:
		form = LoginForm()
	return render(request, 'login.html', {'form': form})

@login_required
def logout_view(request):
	logout(request)
	messages.success(request, "Déconnexion réussie !")
	return redirect(reverse('authe:login'))

class CustomUserAPIView(APIView):
	def get(self, request, id=None):
		if id:
			try:
				user = CustomUser.objects.get(id=id)
				serializer = CustomUserSerializer(user)
			except CustomUser.DoesNotExist:
				raise NotFound(f"User with ID {id} not found.")
		else:
			users = CustomUser.objects.all()
			serializer = CustomUserSerializer(users, many=True)
		return Response(serializer.data)

class MessageAPIView(APIView):
	def get(self, request):
		# Récupérer les messages
		messages = Message.objects.all()
		return Response({'messages': messages})
	
class MeAPIView(APIView):
	def get(self, request):
		# Récupérer les informations de l'utilisateur connecté
		if request.user.is_authenticated:
			serializer = CustomUserSerializer(request.user)
			return Response(serializer.data)
		else:
			return Response({'error': 'Vous n\'êtes pas connecté.'}, status=401)
		
class TournamentAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		data = request.data
		if 'id' in data:
			tournament = Tournament.objects.get(id=data.get('id'))
			serializer = TournamentSerializer(tournament)
			return Response(serializer.data)
		tournaments = Tournament.objects.all()
		serializer = TournamentSerializer(tournaments, many=True)
		return Response(serializer.data)
	
	def post(self, request, *args, **kwargs):
		# Récupérer les données envoyées par le POST
		tournament_id = request.data.get('tournament_id')
		username = request.data.get('username')
		team_name = request.data.get('team_name', None)  # Optionnel

		# creer un tournoi si il n'existe pas
		obj = Tournament.objects.filter(type_pong=tournament_id)
		if not obj.exists():
			tournament = Tournament.objects.create(type_pong=tournament_id)
			tournament.save()
		else:
			tournament = obj.first()
			
		# Vérifier les données reçues
		if not username:
			return Response(
				{"error": "Username are required."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Récupérer le tournoi et l'utilisateur
		tournament = get_object_or_404(Tournament, type_pong=tournament_id)
		player = get_object_or_404(CustomUser, username=username)

		# Vérifier si le tournoi est plein
		if tournament.player_entries.count() >= 8:
			return Response(
				{"error": "Tournament is already full."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Ajouter le joueur au tournoi via PlayerEntry
		is_host = True if tournament.player_entries.count() <= 0 else False
		player_entry, created = PlayerEntry.objects.get_or_create(
			tournament=tournament, player=player, defaults={"team_name": team_name}, is_host=is_host
		)

		if not created:
			return Response(
				{"error": "Player is already in the tournament."},
				status=status.HTTP_200_OK,
			)

		# Réponse réussie
		return Response(
			{
				"message": "Player added to the tournament.",
				"tournament_id": tournament.id,
				"players": [entry.player.username for entry in tournament.player_entries.all()],
			},
			status=status.HTTP_200_OK,
	)	

class MatchmakingAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		# Récupérer les matchs
		matchs = Match.objects.all()
		serializer = MatchSerializer(matchs, many=True)
		return Response(serializer.data)
	
	def post(self, request, *args, **kwargs):
		# Récupérer les données envoyées par le POST
		tournament_id = request.data.get('tournament_id')

		# Récupérer le tournoi
		tournament = get_object_or_404(Tournament, type_pong=tournament_id)

		# Vérifier si le tournoi est plein
		if tournament.player_entries.count() < 8:
			return Response(
				{"error": "Tournament is not full."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		
		# Vérifier si le matchmaking est déjà fait
		if tournament.matchmaking:
			return Response(
				{"error": "Matchmaking already done."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		
		# Récupérer les joueurs du tournoi
		players = [entry.player for entry in tournament.player_entries.all()]
		print(f"\033[1;32mMatchmaking for tournament {tournament_id}...\033[0m")
		for player in players:
			print(f"\033[1;32m- {player}\033[0m")

		# Créer les matchs aléatoirement et sans doublons
		matchs = []
		for i in range(4):
			team1 = players.pop(randint(0, len(players) - 1))
			team2 = players.pop(randint(0, len(players) - 1))
			match = Match.objects.create(player1=team1, player2=team2)
			matchs.append(match)
			if tournament.match_entries.count() <= 3:
				print(f"\033[1;32mMatch between {team1} and {team2}\033[0m")
				tournament.add_match(team1, team2)
			print(f"\033[1;32mMatch between {team1} and {team2}\033[0m")

		# Marquer le tournoi comme en matchmaking
		tournament.matchmaking = True
		tournament.started_at = now()
		tournament.status = "started"
		tournament.started = True
		tournament.save()

		# Réponse réussie
		return Response(
			{
				"message": "Matchmaking successful.",
				"tournament_id": tournament.id,
				"matchs": [match.id for match in matchs],
			},
			status=status.HTTP_200_OK,
	)


class FillTournamentAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		# Récupérer tous les tournois
		tournaments = Tournament.objects.all()
		serializer = TournamentSerializer(tournaments, many=True)
		return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		# Récupérer les données envoyées par le POST
		tournament_type = request.data.get('tournament_type')  # Renommé pour éviter confusion avec un ID
		nb_players = int(request.data.get('nb_players', 0))

		# Vérifier le type de tournoi
		if tournament_type == 'pong':
			type_pong = True
			tournamentName = "Pong"
		else:
			type_pong = False
			tournamentName = "SpaceBattle"

		print(f"\033[1;32mFilling tournament {tournamentName}...\033[0m")
		# Récupérer le tournoi correspondant
		tournament = Tournament.objects.filter(type_pong=type_pong).annotate(player_count=Count('player_entries')).first()
		if not tournament:
			return Response({"error": "No tournament found for this type."}, status=status.HTTP_404_NOT_FOUND)

		print(f"\033[1;32mFilling tournament {tournament.player_entries.count()}...\033[0m")

		# Vérifier si le tournoi est déjà plein
		if tournament.player_entries.count() >= 8:
			return Response(
				{"error": "Tournament is already full."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Supprimer uniquement les IA associées à CE tournoi
		for player in tournament.player_entries.all():
			if player.player.username.startswith("AI_") and tournament.player_entries.filter(player=player.player).exists():
				print(f"\033[1;32mRemoving AI player {player.player.username}...\033[0m")
				tournament.remove_player(player.player)

		# Vérifier combien de places sont encore disponibles
		remaining_slots = 8 - tournament.player_entries.count()

		print(f"\033[1;32mAdding {remaining_slots} AI players to the tournament...\033[0m")
		for i in range(remaining_slots):
			ai_username = f"AI_{i + 1}_{tournamentName}"
			ai_email = f"ia_{i + 1}_{tournamentName}@example.com"

			# Vérifier si l'IA existe déjà
			ai_player, created = CustomUser.objects.get_or_create(username=ai_username, defaults={'email': ai_email})
			if created:
				print(f"\033[1;32mCreated AI player {ai_username}\033[0m")

			# Ajouter l'IA au tournoi
			tournament.add_player(ai_player, team_name=f"AI_of_the_doom_{i + 1}")

		tournament.matchmaking = False
		tournament.save()

		# Réponse réussie
		return Response(
			{
				"message": "Tournament filled with AI players.",
				"tournament_id": tournament.id,
				"nb_players": tournament.player_entries.count(),
			},
			status=status.HTTP_200_OK,
		)

