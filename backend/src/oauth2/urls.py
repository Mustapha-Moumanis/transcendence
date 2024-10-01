from django.urls import path, include
from .views import GoogleLogin, IntraLogin

urlpatterns = [
    # path('accounts/', include('allauth.urls')),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('login/intra/', IntraLogin.as_view(), name='intra_login'),
]
