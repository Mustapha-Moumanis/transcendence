from .models import LocalGame
from .serializers import LocalGameSerializer

from rest_framework import viewsets
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
        
        if user_score > opponent_score:
            local_game.result = "Win"
            self.request.user.wins += 1
        else:
            local_game.result = "Loss"
            self.request.user.losses += 1

        local_game.save()
        self.request.user.save()