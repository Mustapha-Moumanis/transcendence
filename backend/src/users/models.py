import os
import random

from django.db import models
from django.contrib.auth.models import AbstractUser
from django_countries.fields import CountryField
from datetime import date, timedelta

def GenerateProfileImagePath(instance, filename):
    ext = filename.split('.')[-1]
    path = f'static/accounts/{instance.id}/images/'
    name = f'profile_image.{ext}'
    return os.path.join(path, name)

def GenerateDefaultImagePath():
    path = f'static/default/{random.randint(1, 12)}.svg'
    return path

def default_18_years_ago():
    return date.today().replace(year=date.today().year - 18)

class User(AbstractUser):
    avatar = models.ImageField(upload_to=GenerateProfileImagePath, max_length=200, default=GenerateDefaultImagePath)
    reset_password_pin = models.CharField(max_length=6, null=True, blank=True)
    status = models.CharField(max_length=20, default='Offline')
    country_select = CountryField(default="PS")
    date_of_birth = models.DateField(null=True, blank=True, default=default_18_years_ago)
    is2faActive = models.BooleanField(default=False)
    otpCheck = models.BooleanField(default=True)
    level = models.IntegerField(default=1)
    exp = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)