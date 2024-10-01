from django.urls import path
from . import consumers

web_urlpatterns = [
    path('ws/<channel_name>/', consumers.ChatConsumer.as_asgi()),
]