from django.urls import path, include
from .views import GoogleLogin, IntraLogin

urlpatterns = [
    path('api/accounts/', include('allauth.urls')),
    path('api/login/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/login/intra/', IntraLogin.as_view(), name='intra_login'),
]
