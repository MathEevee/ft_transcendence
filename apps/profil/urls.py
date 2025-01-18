from django.urls import path
from . import views

app_name = 'profil'

urlpatterns = [
    path('', views.profil_view, name='profil'),
    path('logout/', views.logout_view, name='logout'),
    path('account/<int:id>/', views.get_profil_view, name='account'),
]
