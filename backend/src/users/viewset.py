from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import ProfilesSerializer
from .permissions import ProfilePermissions

class ProfilesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProfilesSerializer
    permission_classes = [IsAuthenticated, ProfilePermissions]
    lookup_field = 'id'

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)
    
    def destroy(self, request, *args, **kwargs):
        pass

from dj_rest_auth.views import LogoutView
from django.http import HttpResponseRedirect

class customLogoutView(LogoutView):

    def logout(self, request):
        response = super().logout(request) 
        cookies_to_clear = ['my-token', 'my-refresh-token', 'messages', 'sessionid']
        for cookie in cookies_to_clear:
            response.delete_cookie(cookie)
        return response
