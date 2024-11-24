from django.urls import path, include
from .router import router as users_router

urlpatterns = [
    path('api/profiles/', include(users_router.urls)),
]