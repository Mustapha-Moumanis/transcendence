from .models import LocalGame, LocalTournament, Player
from .serializers import LocalGameSerializer, PlayersDataSerializer, EventsTournamentSerializer, LocalTournamentSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class LocalGameHistoryViewSet(viewsets.ModelViewSet):
	serializer_class = LocalGameSerializer
	permission_classes = [IsAuthenticated, ]

	def get_queryset(self):
		return LocalGame.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		local_game = serializer.save(user=self.request.user)
		user_score = local_game.user_score
		opponent_score = local_game.opponent_score
		user = self.request.user
		if user_score > opponent_score:
			local_game.result = "Win"
			user.wins += 1
			user.exp += 250
		else:
			local_game.result = "Loss"
			user.losses += 1
			user.exp += 100
		
		max_exp = user.level * 1000
		if user.exp >= max_exp:
			user.level += 1
			user.exp -= max_exp

		local_game.save()
		user.save()

class CreateTournamentPlayersViewSet(viewsets.ModelViewSet):
	serializer_class = PlayersDataSerializer
	permission_classes = [ IsAuthenticated ]
	http_method_names = ['post', 'head', 'options']
	
	def create(self, request, *args, **kwargs):
		data = request.data
		serializer = self.get_serializer(data=data)
		if serializer.is_valid():
			tournament = LocalTournament.objects.create(user = request.user)
			res = {}
			res["key"] = tournament.key
			players = []
			for key, value in serializer.data.items():
				if key == "player1":
					player = Player.objects.create(name=value, avatar= request.user.avatar)
				else :
					player = Player.objects.create(name=value)
				res[key] = {}
				res[key]["name"] = value
				res[key]["avatar"] = f'{player.avatar}'
				players.append(player)
			tournament.players.set(players)
			return Response(res, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventsTournamentPlayersViewSet(viewsets.ModelViewSet):
	serializer_class = EventsTournamentSerializer
	permission_classes = [ IsAuthenticated ]
	http_method_names = ['post', 'head', 'options']

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({"message": "Tournament saved successfully."}, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocalTournamentViewSet(viewsets.ReadOnlyModelViewSet):
	serializer_class = LocalTournamentSerializer
	permission_classes = [ IsAuthenticated ]

	def get_queryset(self):
		return LocalTournament.objects.filter(user = self.request.user)