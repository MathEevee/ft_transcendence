from django.http import HttpResponse
from django.template import loader

def test(request):
    template = loader.get_template('login.html')
    return (HttpResponse(template.render()))

def pong(request):
    template = loader.get_template('pong.html')
    return (HttpResponse(template.render()))

def index(request):
    template = loader.get_template('index.html')
    return (HttpResponse(template.render()))

def default(request):
    template = loader.get_template('default.html')
    return (HttpResponse(template.render()))