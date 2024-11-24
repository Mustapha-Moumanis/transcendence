from django.urls import path, include
from .router import router as friends_router
urlpatterns = [
    path('api/friends/', include(friends_router.urls)),
]
