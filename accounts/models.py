from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import is_password_usable
from django.contrib.auth.hashers import make_password
from django.db import models

class CustomUser(AbstractUser):
    def save(self, *args, **kwargs):
        if self.password and not is_password_usable(self.password):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    # Champs spécifiques pour l'intégration avec 42
    email = models.EmailField(unique=True)
    id_42 = models.CharField(max_length=255, unique=True)  # ID fourni par l'API 42

    def __str__(self):
        return self.username
