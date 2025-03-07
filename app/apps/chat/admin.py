from django.contrib import admin
from .models import Friend, Channel, Message, Relationship

@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
    model = Friend
    list_display = ['user', 'friend', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['user__username', 'friend__username']

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    model = Channel
    list_display = ['name', 'created_at', 'get_members']
    search_fields = ['name']
    filter_horizontal = ['members']  # Interface améliorée pour les relations ManyToMany

    def get_members(self, obj):
        return ", ".join([user.username for user in obj.members.all()])
    get_members.short_description = 'Members'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    model = Message
    list_display = ('sender', 'recipient', 'channel', 'content', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sender__username', 'recipient__username', 'content')

@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'target', 'relations')
    list_filter = ('relations',)
    search_fields = ('user__username', 'target__username')
    ordering = ('id',)