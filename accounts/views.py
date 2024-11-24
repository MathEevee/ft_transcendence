import requests
import pprint
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.conf import settings
from .models import CustomUser
from .forms import RegistrationForm, LoginForm

def auth_with_42(request):
    client_id = settings.OAUTH_UID
    # redirect_uri = '<VOTRE_REDIRECT_URI>'
    redirect_uri = request.build_absolute_uri(reverse('accounts:auth_callback'))
    scope = 'public'  # Demande d'accès aux informations publiques de l'utilisateur
    auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}'
    return redirect(auth_url)

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
        'redirect_uri': request.build_absolute_uri(reverse('accounts:auth_callback')),
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

    # Débogage : affichez les données reçues dans la console
    pprint.pprint(user_info)

    # # check if not used email in database
    # try:
    #     user = CustomUser.objects.get(email=user_info['email'])
    #     if user.intra_id != user_info['id']:
    #         raise Exception("email conflict.")
    # except CustomUser.DoesNotExist:
    #     pass

    # Sauvegarder ou connecter l'utilisateur ici
    user = save_user(user_info)

    # Connecter l'utilisateur
    login(request, user)
    messages.success(request, f"Bienvenue, {user.username}!")
    return redirect(reverse('accounts:profile'))

def save_user(user_info):
    user, created = CustomUser.objects.get_or_create(
        intra_id=user_info['id'],
        defaults={
            'username': user_info['login'],
            'email': user_info['email'],
            'profile_image': user_info.get('image_url', ''),
        }
    )
    return user

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Inscription réussie ! Connectez-vous.")
            return redirect(reverse('accounts:login'))
    else:
        form = RegistrationForm()
    return render(request, 'accounts/register.html', {'form': form})

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
                return redirect(reverse('accounts:profile'))
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, "Déconnexion réussie !")
    return redirect(reverse('accounts:login'))

@login_required
def profile_view(request):
    return render(request, 'accounts/profile.html', {'user': request.user})
