from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.game_view, name='games'),
    path('spaceinvader', views.space_invader_view, name='games_spaceinvader'),
    path('pong', views.game_view, name='games_pong'),
]
