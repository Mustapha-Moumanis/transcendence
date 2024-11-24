
from django.contrib import admin

from django.urls import path, re_path, include
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import LoginView, UserDetailsView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView

from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view

from users.viewset import customLogoutView

urlpatterns = [
    path('api/admin/', admin.site.urls),
    
    # Authentication
    path("api/register/", RegisterView.as_view(), name="rest_register"),
    path("api/login/", LoginView.as_view(), name="rest_login"),
    path("api/logout/", customLogoutView.as_view(), name="rest_logout"),
    path("api/user/", UserDetailsView.as_view(), name="rest_user_details"),
    path("api/password/change/", PasswordChangeView.as_view(), name="rest_password_change"),
    path('api/resend-email/', ResendEmailVerificationView.as_view(),
         name="rest_resend_email"),
    re_path(
        r'api/^account-confirm-email/', VerifyEmailView.as_view(),
        name='account_confirm_email',
    ),
    path('api/password/reset/', PasswordResetView.as_view(), name='rest_password_reset'),
    path('api/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # oauth2
    path('', include('oauth2.urls')),

    # Friends
    path('', include('friends.urls')),
    
    # Profiles
    path("", include('users.urls')),
    
    # Two Factor Auth
    path('', include('twoFactorAuth.urls')),

    # JWT token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/', get_refresh_view().as_view(), name='token_refresh'),

    # Game
    path('', include('game.urls')),
]
