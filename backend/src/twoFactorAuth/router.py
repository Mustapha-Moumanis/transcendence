from rest_framework import routers
from . import viewset

router = routers.DefaultRouter()
router.register('', viewset.TwoFactorAuthViewSet, 'TwoFactorAuth')
# router.register('qrcode', viewset.QRCodeViewSet, 'QRCode')

# router.register('request', viewset.FriendRequestViewset, 'friend-request')