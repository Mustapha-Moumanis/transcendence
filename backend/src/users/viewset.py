from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from friends.models import BlockedUser
from .serializers import ProfilesSerializer
from .permissions import ProfilePermissions

class ProfilesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProfilesSerializer
    permission_classes = [IsAuthenticated, ProfilePermissions]
    lookup_field = 'username'

    def get_queryset(self):
        current_user = self.request.user
        # NOTE get list of blocked users and use flat to querying for one field not a list of tuples

        blocked_users = BlockedUser.objects.filter(blocker=current_user).values_list('blocked', flat=True)
        blocked_me = BlockedUser.objects.filter(blocked=current_user).values_list('blocker', flat=True)

        Removed_users = set(blocked_users).union(blocked_me)
        Removed_users.add(current_user.id)

        return User.objects.exclude(id__in=Removed_users)

from dj_rest_auth.views import LogoutView
from django.http import HttpResponseRedirect

class customLogoutView(LogoutView):

    def logout(self, request):
        response = super().logout(request) 
        cookies_to_clear = ['my-token', 'my-refresh-token', 'messages', 'sessionid']
        for cookie in cookies_to_clear:
            response.delete_cookie(cookie)
        return response
