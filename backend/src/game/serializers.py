from rest_framework import serializers
from .models import LocalGame, Player, Match, LocalTournament
# from users.serializers import ProfilesSerializer
from django.core.validators import URLValidator, ValidationError

import re
import uuid

class LocalGameSerializer(serializers.ModelSerializer):

	class Meta:
		model = LocalGame
		fields = ['nickname', 'opponent', 'user_score', 'opponent_score', 'result']
		read_only_fields = ['user', 'result']

	# def to_representation(self, instance):
	#     representation = super().to_representation(instance)

	#     if instance.user_score > instance.opponent_score:
	#         representation['result'] = "Win"
	#     elif instance.user_score < instance.opponent_score:
	#         representation['result'] = "Loss"
	#     return representation

# class MatchSerializer(serializers.Serializer):
# 	player1 = serializers.CharField(max_length=100)
# 	player2 = serializers.CharField(max_length=100)
# 	winner = serializers.CharField(max_length=100)
# 	player1_score = serializers.IntegerField()
# 	player2_score = serializers.IntegerField()

# 	class Meta:
# 		model = Match

# class BracketDataSerializer(serializers.Serializer):
# 	# bracket01 = MatchSerializer()
# 	# bracket02 = MatchSerializer()
# 	# bracketFinal = MatchSerializer()

# 	class Meta:
# 		model = LocalTournament

class PlayersDataSerializer(serializers.Serializer):
	player1 = serializers.CharField(max_length=100)
	player2 = serializers.CharField(max_length=100)
	player3 = serializers.CharField(max_length=100)
	player4 = serializers.CharField(max_length=100)

	def validate_name(self, name, player_name):
		pattern = r'^[a-zA-Z][a-zA-Z_-]{0,19}$'
		if not re.match(pattern, name):
			raise serializers.ValidationError(f'Invalid {player_name} name')
		return name

	def validate_player1(self, value):
		return self.validate_name(value, "player1")

	def validate_player2(self, value):
		return self.validate_name(value, "player2")

	def validate_player3(self, value):
		return self.validate_name(value, "player3")

	def validate_player4(self, value):
		return self.validate_name(value, "player4")

	def validate(self, attrs):
		if len(attrs.values()) != len(set(attrs.values())):
			raise serializers.ValidationError({"detail": "Duplicate player names are not allowed."})

		return attrs

class PlayerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Player
		fields = ['name', 'avatar']

class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = ['player1', 'player2', 'winner', 'player1_score', 'player2_score']


class LocalTournamentSerializer(serializers.ModelSerializer):
	players = PlayerSerializer(many=True)
	champion = PlayerSerializer()
	matchs = MatchSerializer(many=True)

	class Meta:
		model = LocalTournament
		fields = ['champion', 'players', 'matchs'] 

class bracketSerializer(serializers.Serializer):
	player1 = serializers.CharField(max_length=100)
	player2 = serializers.CharField(max_length=100)
	player1_score = serializers.IntegerField()
	player2_score = serializers.IntegerField()

	def validate_name(self, name, player_name):
		pattern = r'^[a-zA-Z][a-zA-Z_-]{0,19}$'
		if not re.match(pattern, name):
			raise serializers.ValidationError(f'Invalid {player_name} name')
		return name

	def validate_player1(self, value):
		return self.validate_name(value, "player1")

	def validate_player2(self, value):
		return self.validate_name(value, "player2")

class EventsTournamentSerializer(serializers.ModelSerializer):
	# key = serializers.IntegerField()
	key = serializers.UUIDField(
		default=uuid.uuid4, 
		error_messages={
			"invalid": "Please ensure it follows the correct format."
		})

	bracket01 = bracketSerializer()
	bracket02 = bracketSerializer()
	bracketFinal = bracketSerializer()

	class Meta:
		model = LocalTournament
		fields = ['key', 'bracket01', 'bracket02', 'bracketFinal'] 

	# def validate(self, attrs):
	# 	players = [
	# 		attrs['bracket01']['player1'],
	# 		attrs['bracket01']['player2'],
	# 		attrs['bracket02']['player1'],
	# 		attrs['bracket02']['player2'],
	# 		attrs['bracketFinal']['player1'],
	# 		attrs['bracketFinal']['player2'],
	# 	]

	# 	pattern = r'^[a-zA-Z][a-zA-Z_-]{0,19}$'
	# 	for player in players:
	# 		if not re.match(pattern, player):
	# 			raise serializers.ValidationError({"detail": f"Invalid player name: {player}"})

	# 	if len(players) != len(set(players)):
	# 		raise serializers.ValidationError({"detail": "Duplicate player names are not allowed."})

	# 	return attrs