from django.contrib import admin
from .models import Game, Player

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'nb_players_required', 'created_at', 'started_at', 'ended_at')
    list_filter = ('type', 'created_at')
    search_fields = ('type',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'game', 'is_host', 'team', 'is_IA')
    list_filter = ('is_host', 'team', 'is_IA')
    search_fields = ('user__username', 'team')
    ordering = ('game', 'user')
    autocomplete_fields = ('user', 'game')
