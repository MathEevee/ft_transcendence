from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from apps.authe.models import CustomUser
from rest_framework.response import Response
from apps.authe.serializer import CustomUserSerializer

from apps.authe.models import CustomUser

@login_required
def profil_view(request, username):
    user_profil = get_object_or_404(CustomUser, username=username)

    stats = {
        'games_played': 10,
        'games_won': 5,
    }
    return render(request, 'profil.html', {'user': request.user, 'stats': stats})

def AccountView(request, friendname):
    return render(request, 'account.html', {'friendname': friendname})


@login_required
def get_profil_view(request, id):
    try:
        user = CustomUserSerializer(CustomUser.objects.get(id=id))
        return JsonResponse({'user': user.data})
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
