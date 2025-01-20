from rest_framework import serializers
from .models import CustomUser
from .models import Tournament
from .models import PlayerEntry

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
            'started', 'created_at', 'started_at', 'ended_at', 'winner'
        ]
