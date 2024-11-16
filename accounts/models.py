from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Champs spécifiques pour l'intégration avec 42
    email = models.EmailField(unique=True)
    id_42 = models.CharField(max_length=255, unique=True)  # ID fourni par l'API 42

    def __str__(self):
        return self.username
