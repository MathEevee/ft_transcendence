from django.http import HttpResponse
from django.template import loader


def ponglocal(request):
    template = loader.get_template('pong.html')
    return (HttpResponse(template.render()))

def index(request):
    template = loader.get_template('index.html')
    return (HttpResponse(template.render()))

def welcome(request):
    template = loader.get_template('welcome.html')
    return (HttpResponse(template.render()))

def spaceinvaders(request):
    template = loader.get_template('spaceInvadeur.html')
    return (HttpResponse(template.render()))

def games(request):
    template = loader.get_template('games.html')
    return (HttpResponse(template.render()))

def pongmenu(request):
    template = loader.get_template('pongMenu.html')
    return (HttpResponse(template.render()))