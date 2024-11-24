from rest_framework import renderers
from django.urls import path

from .viewset import LocalGameHistoryViewSet, LocalTournamentViewSet, CreateTournamentPlayersViewSet, EventsTournamentPlayersViewSet
game_history_list = LocalGameHistoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

tournament_list = LocalTournamentViewSet.as_view({
    'get': 'list',
})

tournament_create = CreateTournamentPlayersViewSet.as_view({
    'post': 'create'
})

tournament_events = EventsTournamentPlayersViewSet.as_view({
    'post': 'create'
})

urlpatterns = [
    path('api/game-history/', game_history_list, name='game-history-list'),
    path('api/tournament/', tournament_list, name='tournament-list'),
    path('api/tournament/create/', tournament_create, name='tournament_create'),
    path('api/tournament/events/', tournament_events, name='tournament-events'),
]