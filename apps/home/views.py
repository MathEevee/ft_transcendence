from django.shortcuts import render
from django.template.loader import get_template

def home_view(request):
    return render(request, 'home.html')
