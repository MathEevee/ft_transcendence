from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome),
    path('login/', views.test),
    path('pong/', views.pong),
]
