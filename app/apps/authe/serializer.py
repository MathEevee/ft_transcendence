
from rest_framework import serializers
from .models import CustomUser, PlayerEntry, Match, MatchEntry, Tournament

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class PlayerEntrySerializer(serializers.ModelSerializer):
	player = CustomUserSerializer()  # Inclure les détails du joueur
	
	class Meta:
		model = PlayerEntry
		fields = ['id', 'player', 'tournament', 'team_name', 'is_host']

class MatchSerializer(serializers.ModelSerializer):
	player1 = CustomUserSerializer()
	player2 = CustomUserSerializer()
	winner = CustomUserSerializer(allow_null=True)
	
	class Meta:
		model = Match
		fields = ['id', 'player1', 'player2', 'score_team1', 'score_team2', 'winner', 'ended_at']

class MatchEntrySerializer(serializers.ModelSerializer):
	player1 = serializers.CharField(source='match.player1.username', read_only=True, max_length=150)
	player2 = serializers.CharField(source='match.player2.username', read_only=True, max_length=150)
	score_team1 = serializers.IntegerField(source='match.score_team1', read_only=True, min_value=0, max_value=100)
	score_team2 = serializers.IntegerField(source='match.score_team2', read_only=True, min_value=0, max_value=100)
	
	class Meta:
		model = MatchEntry
		fields = ['id', 'tournament', 'player1', 'player2', 'score_team1', 'score_team2', 'status']

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['id', 'type_pong', 'players', 'player_entries', 'matchlist', 'match_entries', 'matchmaking', 'status', 'started', 'created_at', 'started_at', 'ended_at', 'winner']
	
		def get_match_entries(self, obj):
			matches = obj.match_entries.select_related('match__player1', 'match__player2')
			return [
				{
					"player1": entry.match.player1.username if entry.match.player1 else None,
					"player2": entry.match.player2.username if entry.match.player2 else None,
					"score_team1": entry.match.score_team1,
					"score_team2": entry.match.score_team2,
				}
				for entry in matches
			]

