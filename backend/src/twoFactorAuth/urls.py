from django.urls import path, include
from .router import router as TwoFactorAuth_router

urlpatterns = [
    path('api/2fa/', include(TwoFactorAuth_router.urls)), 
]
