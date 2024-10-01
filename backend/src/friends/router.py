from rest_framework import routers
from . import viewset

router = routers.DefaultRouter()
router.register('', viewset.FriendViewSet, 'friend')
# router.register('request', viewset.FriendRequestViewset, 'friend-request')