from django.db import models
from users.models import User

class LocalGame(models.Model):
    user = models.ForeignKey(User, related_name='local_games', on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
    opponent = models.CharField(max_length=50)
    user_score = models.IntegerField()
    opponent_score = models.IntegerField()
    result = models.CharField(max_length=10, choices=[('Win', 'Win'), ('Loss', 'Loss')], default='Win')

    def __str__(self):
        return f"Game: {self.user.username} vs {self.opponent}"
