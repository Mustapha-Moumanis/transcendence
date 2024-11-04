from rest_framework import serializers
from friends.models import Friend
from users.serializers import ProfilesSerializer
from django.core.validators import URLValidator, ValidationError

class FriendSerializer(serializers.ModelSerializer):
    to_user = serializers.HyperlinkedRelatedField(
        source='user', 
        read_only=True, 
        view_name='profile-detail',
        lookup_field='id',
    )
    from_user = serializers.HyperlinkedRelatedField(
        source='followedUser', 
        read_only=True, 
        view_name='profile-detail',
        lookup_field='id',
    )

    class Meta:
        model = Friend
        fields = ('url', 'from_user', 'to_user',)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request and hasattr(request, 'user'):
            if instance.followedUser == request.user:
                avatar_url = instance.user.avatar
                if avatar_url:
                    try:
                        url_value = str(avatar_url)
                        URLValidator()(url_value)
                    except ValidationError:
                        url_value = avatar_url.url
                return {
                    "id": instance.user.id,
                    "username": instance.user.username,
                    "status": instance.user.status,
                    "avatar": url_value,
                }
            elif instance.user == request.user:
                avatar_url = instance.followedUser.avatar
                if avatar_url:
                    try:
                        url_value = str(avatar_url)
                        URLValidator()(url_value)
                    except ValidationError:
                        url_value = avatar_url.url
                return {
                    "id": instance.followedUser.id,
                    "username": instance.followedUser.username,
                    "status": instance.followedUser.status,
                    "avatar": url_value,
                }
        
        return representation
    
    # def to_representation(self, instance):
        # representation = super().to_representation(instance)
        # avatar_url = instance.avatar

        # if avatar_url:
        #     try:
        #         url_value = str(avatar_url)
        #         URLValidator()(url_value)
        #         representation['avatar'] = url_value
        #     except ValidationError:
        #         representation['avatar'] = avatar_url.url
        # return representation