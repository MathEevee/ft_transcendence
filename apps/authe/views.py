import requests
# import pprint
import logging
import os
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.conf import settings
from django.utils.timezone import now
from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CustomUser, Message, Tournament
from .forms import RegistrationForm, LoginForm
from .serializer import CustomUserSerializer, TournamentSerializer
from .decorators import logout_required

logger = logging.getLogger(__name__)

@logout_required
def auth_with_42(request):
	client_id = settings.OAUTH_UID
	# redirect_uri = '<VOTRE_REDIRECT_URI>'
	redirect_uri = request.build_absolute_uri(reverse('authe:auth_callback'))
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

	# Préparer la requête pour obtenir un token
	token_url = 'https://api.intra.42.fr/oauth/token'
	data = {
		'grant_type': 'authorization_code',
		'client_id': settings.OAUTH_UID,
		'client_secret': settings.OAUTH_SECRET,
		'code': code,
		'redirect_uri': request.build_absolute_uri(reverse('authe:auth_callback')),
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

	# # Débogage : affichez les données reçues dans la console
	# pprint.pprint(user_info)

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

# @login_required
# def get_profil_view(request, name):
# 	try:
# 		user = CustomUser.objects.get(username = name)
# 		return JsonResponse({'email': user.email})
# 	except CustomUser.DoesNotExist:
# 		return JsonResponse({'error': True})

class CustomUserAPIView(APIView):
	def get(self, request):
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
	
	def post(self, request):
		serializer = TournamentSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=201)
		return Response(serializer.errors, status=400)
	
	def put(self, request):
		tournament = Tournament.objects.get(id=request.data.get('id'))
		serializer = TournamentSerializer(tournament, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=200)
		return Response(serializer.errors, status=400)
	
	def delete(self, request):
		tournament = Tournament.objects.get(id=request.data.get('id'))
		tournament.delete()
		return Response(status=204)