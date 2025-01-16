import datetime
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Game,Player


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
    return render(request, 'pongTournament.html')

@login_required
def space_tournament(request):
    return render(request, 'spaceTournament.html')

@login_required
def start_game_local_IA(request):
    data = json.loads(request.body)
    game = Game.objects.create(type = data['type'], nb_players_required = 2, started_at = datetime.datetime.fromtimestamp(data['started_at'] / 1000))
    game.save()
    player = Player.objects.create(user = request.user, game = game, team = None, is_host = True, is_IA = False)
    player.save()
    player = Player.objects.create(user = None, game = game, team = None, is_host = False, is_IA = True)
    player.save()
    return JsonResponse({"id": game.id})

@login_required
def end_game_local_IA(request):
    data = json.loads(request.body)
    try:
        game = Game.objects.get(id=data['id'])
        if (game.ended_at != None):
            return JsonResponse({'error': True, 'message':'Game already end'})
        players = Player.objects.filter(game = game).order_by('is_IA').values()
        game.ended_at = data['ended_at']
        players[0].score = data['score_IA']
        players[1].score = data['score_player']
        players[0].save()
        players[1].save()
        # players.save()
        game.save()
        return JsonResponse({'error':False})
    except Game.DoesNotExist:
        return JsonResponse({'error': True, 'message':'Invalid ID'})
