from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    intra_id = models.IntegerField(unique=True)
    profile_image = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
