from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'authe'

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('settings/', views.settings_view, name='user-settings'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # change password
    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='password_change.html'), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='password_change_done.html'), name='password_change_done'),
    
    # for authentification 42
    path('oauth42/', views.auth_with_42, name='oauth42'),
    path('oauth42/callback/', views.auth_callback, name='auth_callback'),

    # for API CustomUsers
    path('api/users/', views.CustomUserAPIView.as_view(), name='api-users'),
    path('api/users/<int:id>/', views.CustomUserAPIView.as_view(), name='api-user'),
	path('api/messages/', views.MessageAPIView.as_view(), name='api-message'),
	path('api/me/', views.MeAPIView.as_view(), name='api-me'),
	path('api/tournaments/', views.TournamentAPIView.as_view(), name='api-tournaments'),
	path('api/tournaments/matchmaking/', views.MatchmakingAPIView.as_view(), name='api-matchmaking'),
	path('api/tournaments/fill/', views.FillTournamentAPIView.as_view(), name='api-fill'),
]
