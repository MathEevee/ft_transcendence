from django.shortcuts import render

def games(request):
    return render(request, 'games.html')

def pong_menu(request):
    return render(request, 'pongMenu.html')

def pong_local(request):
    return render(request, 'pong.html')

def space_invader(request):
    return render(request, 'spaceInvadeur.html')
