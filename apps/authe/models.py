from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # intra_id = models.IntegerField(unique=True)
    intra_id = models.CharField(max_length=255, null=True, blank=True, unique=True) # accept NULL for register.html
    email = models.EmailField(unique=True)
    profil_picture = models.URLField(max_length=500, null=True, blank=True)
    is_online = models.BooleanField(default=False)
    last_connect = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username
