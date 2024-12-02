from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


def games(request):
    return render(request, 'games.html')

def pong_menu(request):
    return render(request, 'pongMenu.html')

def pong_local(request):
    return render(request, 'pong.html')

def space_invader(request):
    template = loader.get_template('spaceInvadeur.html')
    return (HttpResponse(template.render()))