import os
import random

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

def GenerateProfileImagePath(instance, filename):
    ext = filename.split('.')[-1]
    path = f'static/accounts/{instance.id}/images/'
    name = f'profile_image.{ext}'
    return os.path.join(path, name)

def GenerateDefaultImagePath():
    path = f'static/default/{random.randint(1, 12)}.svg'
    return path

class User(AbstractUser):
    avatar = models.ImageField(upload_to=GenerateProfileImagePath, max_length=200, default=GenerateDefaultImagePath)
    reset_password_pin = models.CharField(max_length=6, null=True, blank=True)
    status = models.CharField(max_length=20, default='Offline')
    country = models.CharField(max_length=20, default='Palestine')
    is2faActive = models.BooleanField(default=False)
    otpCheck = models.BooleanField(default=False)