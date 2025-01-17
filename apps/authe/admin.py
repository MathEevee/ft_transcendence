from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Tournament

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'intra_id', 'is_staff', 'is_superuser', 'is_online', 'last_login','profil_picture']
    list_filter = ['is_staff', 'is_superuser']
    search_fields = ['username', 'email']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('intra_id', 'profil_picture')}),
    )

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    model = Tournament
    list_display = ['get_players', 'teamname', 'status', 'started', 'created_at', 'started_at', 'ended_at','winner']
    list_filter = ['status', 'started']
    search_fields = ['teamname']

    def get_players(self, obj):
        return ", ".join([player.username for player in obj.players.all()])
    get_players.short_description = "Players"

