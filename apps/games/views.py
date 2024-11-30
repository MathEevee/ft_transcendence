from django.shortcuts import render

def game_view(request):
    return render(request, 'games.html')
def space_invader_view(request):
    return render(request, 'spaceInvadeur.html')