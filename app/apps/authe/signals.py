from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.utils.timezone import now
from .models import CustomUser

@receiver(user_logged_in)
def set_user_online(sender, request, user, **kwargs):
    if isinstance(user, CustomUser):
        user.is_online = True
        user.last_seen = now()
        user.save()

@receiver(user_logged_out)
def set_user_offline(sender, request, user, **kwargs):
    if isinstance(user, CustomUser):
        user.is_online = False
        user.save()
