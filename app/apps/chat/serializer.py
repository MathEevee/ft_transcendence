from rest_framework import serializers
from .models import Relationship

class RelationshipSerializer(serializers.ModelSerializer):
    # pour renvoyer le username et non l'id par defaut
    # target = serializers.CharField(source='target.username')

    class Meta:
        model = Relationship
        fields = ['target', 'relations']
