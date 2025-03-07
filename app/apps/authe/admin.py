from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Tournament, PlayerEntry

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
	model = CustomUser
	list_display = ['id', 'username', 'email', 'intra_id', 'is_staff', 'is_superuser', 'is_online', 'profil_picture']
	list_filter = ['is_staff', 'is_superuser']
	search_fields = ['username', 'email']
	exclude = ('last_login',)
	fieldsets = (
		(None, {'fields': ('username', 'email', 'password')}),
		('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		('Informations personnelles', {'fields': ('first_name', 'last_name', 'intra_id', 'profil_picture')}),
		('Dates', {'fields': ('date_joined',)}),
	)

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
	model = Tournament
	list_display = ['id', 'type_pong', 'get_players', 'status', 'started', 'created_at', 'started_at', 'ended_at','winner']
	list_filter = ['status', 'started', 'type_pong']
	search_fields = ['status', 'player_entries__player__username', 'player_entries__team_name']

	def get_players(self, obj):
		return ", ".join(
			[f"{e.player.username} (Team: {e.team_name})" for e in obj.player_entries.all()])
	get_players.short_description = "Players (Team)"

@admin.register(PlayerEntry)
class PlayerEntryAdmin(admin.ModelAdmin):
	model = PlayerEntry

	# Colonnes à afficher dans la liste des entrées de joueurs
	list_display = ['tournament', 'player', 'team_name']
	search_fields = ['tournament__id', 'player__username', 'team_name']