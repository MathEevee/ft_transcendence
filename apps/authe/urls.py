from django.urls import path
from . import views

app_name = 'authe'

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    
    # for authentification 42
    path('oauth42/', views.auth_with_42, name='oauth42'),
    path('oauth42/callback/', views.auth_callback, name='auth_callback'),

    # for API CustomUsers
    path('api/users/', views.CustomUserAPIView.as_view(), name='api-users'),
	path('api/messages/', views.MessageAPIView.as_view(), name='api-message'),
]
