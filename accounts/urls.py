from django.urls import path
from .views import accounts

urlpatterns = [
    path('', accounts, name='accounts'),
]
