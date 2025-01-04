from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    # path('', views.game_view, name='games'),
    # path('spaceinvader', views.space_invader_view, name='games_spaceinvader'),
    # path('pong', views.game_view, name='games_pong'),
    path('', views.games),
    path('pong/', views.pong_menu),
    path('pong/local/', views.pong_local),
    path('pong/solo/', views.pong_local),
    path('pong/online/', views.pong_local),
    path('spaceinvaders/', views.space_invader),
    path('pong/tournament/', views.pong_tournament),
    path('spaceinvaders/tournament/', views.space_tournament),
]
