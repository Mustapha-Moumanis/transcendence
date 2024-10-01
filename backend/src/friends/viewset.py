from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .serializers import FriendSerializer
from .models import Friend

class FriendViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = FriendSerializer

    def get_queryset(self):
        return Friend.objects.friends(self.request.user)
