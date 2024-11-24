from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse

@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "Déconnexion réussie !")
    return redirect(reverse('authe:login'))

@login_required
def profil_view(request):
    stats = {
        'games_played': 10,
        'games_won': 5,
    }
    return render(request, 'profil.html', {'user': request.user, 'stats': stats})
