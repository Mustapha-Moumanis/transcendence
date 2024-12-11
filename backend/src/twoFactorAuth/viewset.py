from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.http import HttpResponse
from io import BytesIO
from rest_framework.decorators import action
import qrcode
from qrcode.image.svg import SvgImage

from .serializers import TwoFactorAuthSerializer
from .permissions import TwoFactorAuthPermissions

class TwoFactorAuthViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TwoFactorAuthPermissions]
    serializer_class = TwoFactorAuthSerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        pass

    def list(self, request, *args, **kwargs):
        if not request.user.is2faActive:
            return Response({"message": "No 2FA device found."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            key = serializer.validated_data['key']
            device, created = TOTPDevice.objects.get_or_create(user=user, confirmed=True)

            if not device.verify_token(key):
                return Response({"message": "The code does not match, try again."}, status=status.HTTP_400_BAD_REQUEST)

            if not user.is2faActive:
                user.is2faActive = True
                
            user.otpCheck = True
            user.save()

            return Response({"message": "2FA verified successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def generate_qr_code(self, request):
        user = request.user
        if user.is2faActive:
            return Response({"message": "No access to generate 2FA qr"}, status=status.HTTP_400_BAD_REQUEST)

        device, created = TOTPDevice.objects.get_or_create(user=user, confirmed=True)

        stream = BytesIO()
        qrcode.make(device.config_url, image_factory=SvgImage).save(stream)

        return HttpResponse(stream.getvalue(), content_type='image/svg+xml')
