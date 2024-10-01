from django.contrib import admin
from .models import Friend, BlockedUser

# Register your models here.
admin.site.register(Friend)
admin.site.register(BlockedUser)