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
    print(request.body)
    data = json.loads(request.body)
    try:
        game = Game.objects.get(id=data['id'])
        if (game.ended_at != None):
            return JsonResponse({'error': True, 'message':'Game already end'})
        player = Player.objects.get(game = game, is_IA = False)
        player_ia = Player.objects.get(game = game, is_IA = True)
        game.ended_at = datetime.datetime.fromtimestamp(data['ended_at'] / 1000)
        player.score = data['score_player']
        player_ia.score = data['score_IA']
        player.save()
        player_ia.save()
        game.save()
        return JsonResponse({'error':False})
    except Game.DoesNotExist:
            return JsonResponse({'error': True, 'message':'Invalid ID'})
    except Player.DoesNotExist:
        return JsonResponse({'error': True, 'message':'Invalid Player ID'})

@login_required
def display_all_game(request):
    history = Player.objects.filter(user=request.user)
    history_list = [ele.json() for ele in history]
    return JsonResponse({'history':history_list})

@login_required
def display_game(request):
    game = Game.objects.get(id=request.GET.get('id'))
    return JsonResponse({'game':game})

    