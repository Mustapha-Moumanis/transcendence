from django.db import models
from django_bleach.models import BleachField
from users.models import User
from django.utils.timezone import now

class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=now)
    creator = models.ForeignKey(User, related_name='chatrooms', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = BleachField()
    timestamp = models.DateTimeField(default=now)
    seen = models.BooleanField(default=False)
    reciver = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.user.username}: {self.content[:20]}...'
