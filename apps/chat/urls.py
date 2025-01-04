from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('send_message/<int:recipient_id>/', views.send_message, name='send_message'),
    path('load_friends/', views.load_friends, name='load_friends'),
    path('load_messages/<int:recipient_id>/', views.load_messages, name='load_messages'),
]
