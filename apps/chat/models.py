from django.db import models
from apps.authe.models import CustomUser

class Friend(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="friends")
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="friend_of")
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted')])
    created_at = models.DateTimeField(auto_now_add=True)

class Channel(models.Model):
    name = models.CharField(max_length=50)
    members = models.ManyToManyField(CustomUser, related_name="channels")
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_sent")
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="messages", null=True, blank=True)
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_received", null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
