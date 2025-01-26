from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from apps.authe.models import CustomUser


@login_required
def profil_view(request, username):
    user_profil = get_object_or_404(CustomUser, username=username)

    stats = {
        'games_played': 10,
        'games_won': 5,
    }
    return render(request, 'profil.html', {'user': user_profil, 'stats': stats})
