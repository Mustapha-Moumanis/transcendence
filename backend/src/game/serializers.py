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
	key = serializers.UUIDField(
		default=uuid.uuid4, 
		error_messages={
			"invalid": "Please ensure it follows the correct format."
		})

	bracket01 = bracketSerializer()
	bracket02 = bracketSerializer()
	bracketFinal = bracketSerializer()

	def validate_key(self, value):
		if not LocalTournament.objects.filter(key = value):
			raise serializers.ValidationError(f'Invalid Key')
		return value

	def validate_players(self, bracket_data, tournament):
		player1_exists = tournament.players.filter(name=bracket_data['player1']).exists()
		player2_exists = tournament.players.filter(name=bracket_data['player2']).exists()

		if not player1_exists or not player2_exists:
			raise serializers.ValidationError({"detail" : "Some players must be part of the tournament."})

	def create(self, data):
		bracket01_data = data.pop('bracket01')
		bracket02_data = data.pop('bracket02')
		bracketFinal_data = data.pop('bracketFinal')

		user = self.context['request'].user
		tournament = LocalTournament.objects.get(key=data['key'], user=user)
		
		if tournament.matchs.count() != 0:
			raise serializers.ValidationError({"detail" : "This tournament already has matches and cannot be modified."})

		for bracket_data in [bracket01_data, bracket02_data, bracketFinal_data]:
			self.validate_players(bracket_data, tournament)

		def create_match(bracket_data):
			player1 = tournament.players.get(name=bracket_data['player1'])
			player2 = tournament.players.get(name=bracket_data['player2'])

			winner = player1 if bracket_data['player1_score'] > bracket_data['player2_score'] else player2

			match = Match.objects.create(
				player1=player1,
				player2=player2,
				winner=winner,
				player1_score=bracket_data['player1_score'],
				player2_score=bracket_data['player2_score']
			)
			return match

		bracket01 = create_match(bracket01_data)
		bracket02 = create_match(bracket02_data)
		bracketFinal = create_match(bracketFinal_data)

		mainPlayer = tournament.players.all().first()

		if bracket01.winner == mainPlayer:
			user.exp += 500 if bracketFinal.winner == mainPlayer else 300
		else:
			user.exp += 100

		if bracketFinal.winner == mainPlayer:
			user.wins += 1
		else:
			user.losses += 1

		max_exp = user.level * 1000
		if user.exp >= max_exp:
			user.level += 1
			user.exp -= max_exp

		tournament.matchs.add(bracket01, bracket02, bracketFinal)
		tournament.champion = tournament.players.get(name=bracketFinal.winner)
		tournament.save()

		user.save()

		return data

	class Meta:
		model = LocalTournament
		fields = ['key', 'bracket01', 'bracket02', 'bracketFinal'] 
