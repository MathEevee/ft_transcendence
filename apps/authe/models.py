from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    intra_id = models.IntegerField(unique=True)
    # profile_image = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True)
    profil_picture = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        help_text="URL de la photo de profil (42 ou choix utilisateur)"
    )

    def __str__(self):
        return self.username
