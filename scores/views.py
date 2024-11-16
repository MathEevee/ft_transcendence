from django.shortcuts import render
from .models import PlayerStats

def scores(request):
    stats = PlayerStats.objects.all()
    return render(request, 'scores.html', {'stats': stats})
