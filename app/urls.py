from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome),
    path('login/', views.test),
    path('games/pong/local/', views.ponglocal),
    path('games/spaceinvaders/', views.spaceinvaders),
]
