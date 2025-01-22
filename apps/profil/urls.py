from django.urls import path
from . import views

app_name = 'profil'

urlpatterns = [
    path('<str:username>/', views.profil_view, name='profil'),
]
