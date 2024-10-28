from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from chat.models import ChatRoom

@receiver(post_save, sender=User)
def create_chat_room_for_user(sender, instance, created, **kwargs):
    if created:
        name = f"room_{instance.username}"
        ChatRoom.objects.get_or_create(name=name, creator=instance)
