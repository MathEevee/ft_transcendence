from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome),
    path('login/', views.test),
    path('games/', views.games),
    path('games/pong/', views.pongmenu),
    path('games/pong/local/', views.ponglocal),
    path('games/pong/solo/', views.ponglocal),
    path('games/pong/online/', views.ponglocal),
    path('games/spaceinvaders/', views.spaceinvaders),
]
