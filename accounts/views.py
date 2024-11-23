import requests
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .models import CustomUser
from .forms import RegistrationForm, LoginForm

def auth_callback(request):
    # Récupérer le code renvoyé par l'intra
    code = request.GET.get('code')
    
    if not code:
        return redirect('/')  # Rediriger vers une page d'erreur ou d'accueil

    # Préparer la requête pour obtenir un token
    token_url = 'https://api.intra.42.fr/oauth/token'
    data = {
        'grant_type': 'authorization_code',
        'client_id': '<VOTRE_CLIENT_ID>',
        'client_secret': '<VOTRE_CLIENT_SECRET>',
        'code': code,
        'redirect_uri': '<VOTRE_REDIRECT_URI>',
    }
    
    # Envoyer la requête pour obtenir un token
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        return redirect('/')  # Gérer les erreurs
    
    token_data = response.json()
    access_token = token_data.get('access_token')

    # Utiliser le token pour récupérer les informations utilisateur
    user_info_url = 'https://api.intra.42.fr/v2/me'
    user_info = requests.get(
        user_info_url,
        headers={'Authorization': f'Bearer {access_token}'}
    ).json()

    # Gérer les informations utilisateur (par ex., sauvegarde en base de données)
    # Exemple de traitement des données utilisateur :
    user_id = user_info.get('id')
    user_email = user_info.get('email')
    user_login = user_info.get('login')

    # Sauvegarder ou connecter l'utilisateur ici

    return redirect('/dashboard')  # Rediriger vers une page de votre application


def auth_with_42(request):
    client_id = '<VOTRE_CLIENT_ID>'
    redirect_uri = '<VOTRE_REDIRECT_URI>'
    scope = 'public'  # Demande d'accès aux informations publiques de l'utilisateur
    auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}'
    return redirect(auth_url)

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
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
