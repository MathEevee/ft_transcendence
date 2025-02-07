from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.games),
    path('pong/', views.pong_menu),
    path('pong/local/', views.pong_local),
    path('pong/solo/', views.pong_local),
    path('pong/online/', views.pong_local),
    path('pong/multiplayer/', views.pong_local),
    path('pong/online/tournament/', views.pong_local),
    path('spaceinvaders/', views.space_invader),
    path('spaceinvaders/online/tournament/', views.space_invader),
    path('pong/tournament/', views.pong_tournament),
    path('spaceinvaders/tournament/', views.space_tournament),
    path('local-ia-start/', views.start_game_local_IA),
    path('local-ia-end/', views.end_game_local_IA),
    path('all_game/<str:username>', views.display_all_game),
    path('game/<int:id>/', views.display_game),
    path('player/<int:id>/', views.search_player_gameID),
    path('pong_online/',views.game_pong_online),
]
