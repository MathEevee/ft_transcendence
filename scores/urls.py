from django.urls import path
from .views import scores

urlpatterns = [
    path('', scores, name='scores'),
]
