from django.contrib import admin
from .models import LocalGame, Player, Match, LocalTournament

# Register your models here.

admin.site.register(LocalGame)
admin.site.register(Player)
admin.site.register(Match)
admin.site.register(LocalTournament)