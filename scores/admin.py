from django.contrib import admin
from .models import PlayerStats

@admin.register(PlayerStats)
class PlayerStatsAdmin(admin.ModelAdmin):
    list_display = ('username', 'games_play', 'games_win', 'total_score')
    search_fields = ('username',)
