from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.test),
    path('pong/', views.pong)
]
