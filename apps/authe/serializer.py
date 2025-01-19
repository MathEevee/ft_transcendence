from rest_framework import serializers
from .models import CustomUser
from .models import Tournament

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'is_online', 'id']

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = '__all__'