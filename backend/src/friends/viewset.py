from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .serializers import FriendSerializer, BlockSerializer
from .models import Friend, BlockedUser

class FriendViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = FriendSerializer

    def get_queryset(self):
        return Friend.objects.friends(self.request.user)

class BlockedViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = BlockSerializer

    def get_queryset(self):
        return BlockedUser.objects.filter(blocker=self.request.user)