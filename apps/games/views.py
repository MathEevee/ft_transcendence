from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def games(request):
    return render(request, 'games.html')

@login_required
def pong_menu(request):
    return render(request, 'pongMenu.html')

@login_required
def pong_local(request):
    return render(request, 'pong.html')

@login_required
def space_invader(request):
    return render(request, 'spaceInvadeur.html')

@login_required
def pong_tournament(request):
    return render(request, 'pongtournament.html')

def space_tournament(request):
    return render(request, 'spacetournament.html')