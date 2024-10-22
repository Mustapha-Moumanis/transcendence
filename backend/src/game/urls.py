from rest_framework import renderers
from django.urls import path

from .viewset import LocalGameHistoryViewSet
game_history_list = LocalGameHistoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    path('game-history/', game_history_list, name='snippet-list'),
]