from django.db import models
from django.core.validators import MaxLengthValidator
from apps.authe.models import CustomUser
from authe.utils import validate_max_length

class Friend(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="friends")
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="friend_of")
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted')])
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

class Channel(models.Model):
    name = models.CharField(max_length=50, validators=[validate_max_length])
    members = models.ManyToManyField(CustomUser, related_name="channels")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_sent")
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="messages", null=True, blank=True)
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_received", null=True, blank=True)
    content = models.TextField(validators=[MaxLengthValidator(1000)])
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True)

class Relationship(models.Model):
    class Status(models.TextChoices):
        NONE = 'none'
        FRIEND = 'friend'
        BLOCKED = 'blocked'
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user")
    target = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="friend")
    relations = models.CharField(max_length=10, choices=Status.choices, default=Status.NONE)
