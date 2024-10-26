from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import User
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer

# Login

class CustomLoginSerializer(LoginSerializer):

    def validate(self, attrs):
        attrs = super().validate(attrs)
        user = attrs['user']
        if user.is2faActive:
            user.otpCheck = False
            user.save()
        return attrs

# Register

from allauth.account.adapter import get_adapter
from allauth.account import app_settings as allauth_account_settings
from django.utils.translation import gettext_lazy as _
from chat.models import ChatRoom
import re

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)

    def validate_first_name(self, first_name):
        pattern = r'^[a-zA-Z][a-zA-Z_-]{0,19}$'
        if not re.match(pattern, first_name):
            raise serializers.ValidationError(
                    _('invalid first name'),
                )
        return first_name

    def validate_last_name(self, last_name):
        pattern = r'^[a-zA-Z][a-zA-Z_-]{0,19}$'
        if not re.match(pattern, last_name):
            raise serializers.ValidationError(
                    _('invalid last name'),
                )
        return last_name

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_account_settings.UNIQUE_EMAIL:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    _('A user is already registered with this e-mail address.'),
                )
        return email

    def generate_unique_username(self, firstname, lastname):
        username = f"{firstname}_{lastname}"
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        return username

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'username': self.generate_unique_username (
                self.validated_data.get('first_name', ''),
                self.validated_data.get('last_name', '')
            ),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }
    
    def save(self, request):
        user = super().save(request)
        name ="room_{}".format(user.username)
        ChatRoom.objects.get_or_create(name=name, creator=user)
        return user
    
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "password2"]

# Password Reset

from .forms import MyAllAuthPasswordResetForm

class MyPasswordResetSerializer(PasswordResetSerializer):

    @property
    def password_reset_form_class(self):
        return MyAllAuthPasswordResetForm

# Password Reset Confirm

from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class MyPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    uid = None
    email = serializers.CharField()

    class Meta:
        fields = ["new_password1", "new_password2", "email", "token"]

    def validate(self, attrs):
        try:
            self.user = UserModel._default_manager.get(email=attrs['email'])
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({'email': [_('Invalid value')]})

        if not self.user.reset_password_pin == attrs['token']:
            raise ValidationError({'token': [_('Invalid value')]})

        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs,
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        
        self.custom_validation(attrs)
        
        self.user.reset_password_pin = ""
        self.user.save()
        
        return attrs

    def save(self):
        return self.set_password_form.save()

# User Details

from django.core.validators import URLValidator, ValidationError

class MyUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = UserModel
        extra_fields = ['username', 'email', 'first_name', 'last_name', 'avatar', 'status', 'country_select', 'date_of_birth', 'is2faActive', 'otpCheck', 'level', 'exp', 'wins', 'losses']
        fields = ('pk', *extra_fields)
        read_only_fields = ('email', 'username', 'status', 'otpCheck', 'level', 'exp', 'wins', 'losses')

    def validate_is2faActive(self, is2faActive):
        otpCheck = self.instance.otpCheck

        if not is2faActive and not otpCheck:
            raise serializers.ValidationError(_('You cannot deactivate 2FA before verifying the key from the authenticator app.'),)
        return is2faActive
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        avatar_url = instance.avatar

        if avatar_url:
            try:
                url_value = str(avatar_url)
                URLValidator()(url_value)
                representation['avatar'] = url_value
            except ValidationError:
                representation['avatar'] = avatar_url.url
        return representation


from .models import User
from friends.models import Friend

class ProfilesSerSerializer(serializers.ModelSerializer):
    is_friend = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'country_select', 'status', 'avatar', 'is_friend')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        avatar_url = instance.avatar

        if avatar_url:
            try:
                url_value = str(avatar_url)
                URLValidator()(url_value)
                representation['avatar'] = url_value
            except ValidationError:
                representation['avatar'] = avatar_url.url
        return representation
    
    def get_is_friend(self, obj):
        current_user = self.context['request'].user
        return Friend.objects.are_friends(current_user, obj)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_name'] = user.username
        return token