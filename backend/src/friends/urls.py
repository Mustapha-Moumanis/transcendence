from django.urls import path, include
from .router import router as friends_router
from .viewset import BlockedViewSet

blocked_list = BlockedViewSet.as_view({
    'get': 'list',
})

urlpatterns = [
    path('api/friends/', include(friends_router.urls)),
    path('api/blocked/', blocked_list, name='blocked-list'),
]
