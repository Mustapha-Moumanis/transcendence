import random
from allauth.account.forms import ResetPasswordForm as DefaultPasswordResetForm
from allauth.account.utils import filter_users_by_email
from django.contrib.sites.shortcuts import get_current_site
from allauth.account import app_settings as allauth_account_settings
from allauth.account.utils import user_username
from allauth.account.adapter import get_adapter
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

UserModel = get_user_model()

class MyAllAuthPasswordResetForm(DefaultPasswordResetForm):

    def generate_password_reset_key():
        key = random.randint(100000, 999999)
        return str(key)

    def clean_email(self):
        email = self.cleaned_data['email']
        self.users = filter_users_by_email(email, is_active=True, prefer_verified=True)
        if not UserModel.objects.filter(email=email).exists():
            raise ValidationError('No user registered with this email address.')
        return email

    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data['email']
        for user in self.users:
            key = MyAllAuthPasswordResetForm.generate_password_reset_key()
            user.reset_password_pin = make_password(key)
            user.save()

            context = {
                'current_site': current_site,
                'user': user,
                'key': key,
                'request': request,
            }
            if (allauth_account_settings.AUTHENTICATION_METHOD != allauth_account_settings.AuthenticationMethod.EMAIL):
                context['username'] = user_username(user)
            get_adapter(request).send_mail('users/password_reset_key', email, context)
        return self.cleaned_data['email']
