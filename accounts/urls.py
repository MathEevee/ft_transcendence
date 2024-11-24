from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    # for authentification 42
    path('oauth42/', views.auth_with_42, name='oauth42'),
    path('oauth42/callback/', views.auth_callback, name='auth_callback'),
]
