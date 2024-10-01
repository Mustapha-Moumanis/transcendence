from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.oauth2.views import OAuth2LoginView, OAuth2CallbackView
from dj_rest_auth.registration.views import SocialLoginView

from .adapter import IntraOAuth2Adapter
from django.conf import settings

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_CALL_BACK_URL
    client_class = OAuth2Client

class IntraLogin(SocialLoginView):
    adapter_class = IntraOAuth2Adapter
    callback_url = settings.INTRA_CALL_BACK_URL
    client_class = OAuth2Client

oauth2_login = OAuth2LoginView.adapter_view(IntraOAuth2Adapter)
oauth2_callback = OAuth2CallbackView.adapter_view(IntraOAuth2Adapter)