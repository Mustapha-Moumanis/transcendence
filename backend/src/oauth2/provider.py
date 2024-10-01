from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider
from allauth.socialaccount.providers.google.provider import GoogleProvider

class CustomGoogleProvider(GoogleProvider):
    def extract_common_fields(self, data):
        return dict(
            email=data.get("email"),
            last_name=data.get("family_name"),
            first_name=data.get("given_name"),
            avatar=data['picture'],
        )

class IntraOAuth2Provider(OAuth2Provider):
    id = 'intra'
    name = 'intra'

    def extract_uid(self, data):
        return str(data['id'])

    def extract_common_fields(self, data):
        return dict(
            username=data.get('login'),
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            avatar=data['image']['versions']['medium'],
        )
    

provider_classes = [IntraOAuth2Provider, CustomGoogleProvider]

# from allauth.socialaccount import providers
# providers.registry.register(CustomGoogleProvider)