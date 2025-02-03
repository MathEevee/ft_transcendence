from rest_framework import serializers
from .models import CustomUser, Tournament, PlayerEntry , Match

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['username', 'is_online', 'id']
            
class PlayerEntrySerializer(serializers.ModelSerializer):
	player = CustomUserSerializer()

	class Meta:
		model = PlayerEntry
		fields = ['player', 'team_name', 'is_host']

class TournamentSerializer(serializers.ModelSerializer):
    player_entries = PlayerEntrySerializer(many=True)

    class Meta:
        model = Tournament
        fields = [
            'id', 'type_pong', 'players', 'player_entries', 'status', 
            'started', 'created_at', 'started_at', 'ended_at', 'winner',
			'matchmaking', 'matchlist'
        ]

class MatchSerializer(serializers.ModelSerializer):
	team1 = PlayerEntrySerializer()
	team2 = PlayerEntrySerializer()
	winner = PlayerEntrySerializer()

	class Meta:
		model = Match
		fields = [
			'tournament', 'team1', 'team2', 'winner', 'created_at', 'ended_at'
		]