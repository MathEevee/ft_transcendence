from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from apps.authe.models import CustomUser
from rest_framework.response import Response
from apps.authe.serializer import CustomUserSerializer


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

def AccountView(request, friendname):
    return render(request, 'account.html', {'friendname': friendname})


@login_required
def get_profil_view(request, id):
    try:
        user = CustomUserSerializer(CustomUser.objects.get(id=id))
        return JsonResponse({'user': user.data})
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
