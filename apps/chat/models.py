from django.db import models
from django.contrib.auth.models import User

class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend_of")
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted')])
    created_at = models.DateTimeField(auto_now_add=True)

class ChannelGroup(models.Model):
    name = models.CharField(max_length=50)
    members = models.ManyToManyField(User, related_name="channels")
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    channel = models.ForeignKey(ChannelGroup, on_delete=models.CASCADE, related_name="messages", null=True, blank=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_received", null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
