from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from apps.authe.models import CustomUser
from apps.games.models import Game,Player
from apps.games.views import display_all_game
from apps.authe.models import Tournament

		# ('Pong 1v1', 'Pong 1v1'),
		# ('Pong 1v1 IA', 'Pong 1v1 IA'),
		# ('Space 1v1', 'Space 1v1'),
		# ('Space IA', 'Space IA'),

@login_required
def profil_view(request, username):
    user_profil = get_object_or_404(CustomUser, username=username)

    players_game = Player.objects.filter(user=user_profil)
    total = len(players_game)
    win = 0
    for player_game in players_game:
        print(player_game.game.type, player_game.score)
        if player_game.game.type == 'Pong 1v1' or player_game.game.type == 'Pong 1v1 IA':
            if (player_game.score == 5):
                win += 1
        elif player_game.game.type == 'Space 1v1' or player_game.game.type == 'Space IA':
            if (player_game.score != 0):
                win += 1

    stats = {
        'games_played': total,
        'games_won': win,
    }
    return render(request, 'profil.html', {'user': user_profil, 'stats': stats})

@login_required
def tournamentHistory_view(request):
    def get(self, request):
        tournaments = Tournament.objects.all()
    return render(request, 'tournamentHistory.html')
