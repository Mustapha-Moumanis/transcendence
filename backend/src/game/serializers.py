from rest_framework import serializers
from .models import LocalGame
from users.serializers import ProfilesSerSerializer
from django.core.validators import URLValidator, ValidationError

class LocalGameSerializer(serializers.ModelSerializer):

    class Meta:
        model = LocalGame
        fields = ['opponent', 'user_score', 'opponent_score', 'result']
        read_only_fields = ['user', 'result']

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)

    #     if instance.user_score > instance.opponent_score:
    #         representation['result'] = "Win"
    #     elif instance.user_score < instance.opponent_score:
    #         representation['result'] = "Loss"
    #     return representation
