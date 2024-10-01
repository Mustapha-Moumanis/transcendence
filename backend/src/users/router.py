from rest_framework.routers import DefaultRouter
from .viewset import ProfilesViewSet

router = DefaultRouter()
router.register('', ProfilesViewSet, basename='profile')