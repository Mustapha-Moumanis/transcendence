from django.db import models
from users.models import User

class FriendManager(models.Manager):
    """ Friend manager """

    def friends(self, user):
        """ Return all friends """

        user_friends = self.filter(user=user, isPending=True)
        followed_friends = self.filter(followedUser=user, isPending=True)
        return user_friends | followed_friends
    
    def friends_list(self, user):
        """ Return a list of all friends """

        friends = self.friends(user)
        
        friends_list = [friend.followedUser if friend.user == user else friend.user for friend in friends]
        return friends_list

    def are_friends(self, user1, user2):
        """ Check if to users are friends """

        friends1 = self.friends(user1).exists()
        friends2 = self.friends(user2).exists()

        return friends1 and friends2
    
    def remove_friend(self, user1, user2):
        """ Remove friend """
        
        if user1 == user2:
            return False, "Users cannot be friends with themselves"
        
        friends1 = self.filter(user=user1, followedUser=user2)
        friends2 = self.filter(user=user2, followedUser=user1)
        friends1.delete()
        friends2.delete()

        return True, "Friend removed successfully"

    def friend_state_request(self, from_user, to_user):
        """ Friend state request """

        if self.filter(user=from_user, followedUser=to_user, isPending=False).exists():
            return "request_sended"
        elif self.filter(user=to_user, followedUser=from_user, isPending=False).exists():
            return "request_received"
        else :
            return None

    def add_friend(self, from_user, to_user):
        """ Add friend """

        if from_user == to_user:
            return False, "Users cannot be friends with themselves"

        if self.are_friends(from_user, to_user):
            return False, "Users are already friends"
        
        if self.filter(user=from_user, followedUser=to_user, isPending=False).exists():
            return False, "You already requested friendship from this user."
        
        if self.filter(user=to_user, followedUser=from_user, isPending=False).exists():
            return False, "This user already requested friendship from you."

        self.create(user=from_user, followedUser=to_user, isPending=False)
        return True, "Friend request successfully sent"


    def accept_friend(self, from_user, to_user):
        """ Accept friend request """

        if from_user == to_user:
            return False, "Users cannot be friends with themselves"

        if self.are_friends(from_user, to_user):
            return False, "Users are already friends"

        friends1 = self.filter(user=from_user, followedUser=to_user).first()
        friends2 = self.filter(user=to_user, followedUser=from_user).first()

        if friends1:
            return False, "Users cannot accept themselves"

        if friends2:
            friends2.isPending = True
            friends2.save()
            return True, "{} accepted the {} request.".format(from_user, to_user)

        return False, "No pending friend request found"

class Friend(models.Model):
    # is the user that followedUser send u a request.
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    followedUser = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    # isPending boolen if true is still not accecpt/decline if accept is false, decline remove.
    isPending = models.BooleanField()

    objects = FriendManager()

    def __str__(self):
        return f'{self.user.username} -> {self.followedUser.username} is pending : {self.isPending}'

class BlockedUser(models.Model):
    blocker = models.ForeignKey(User, related_name='blocker', on_delete=models.CASCADE, null=True, blank=True)
    blocked = models.ForeignKey(User, related_name='blocked', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'{self.blocker.username} blocked {self.blocked.username}'
