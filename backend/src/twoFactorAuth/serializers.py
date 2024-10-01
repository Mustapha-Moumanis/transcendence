from rest_framework import serializers
from django_otp.plugins.otp_totp.models import TOTPDevice

class TwoFactorAuthSerializer(serializers.ModelSerializer):
    key = serializers.CharField()

    class Meta:
        model = TOTPDevice
        fields = ('key', )
