import uuid
from django.db import models
from users.models import User, GenerateDefaultImagePath

class LocalGame(models.Model):
    user = models.ForeignKey(User, related_name='local_games', on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
    opponent = models.CharField(max_length=50)
    user_score = models.IntegerField()
    opponent_score = models.IntegerField()
    result = models.CharField(max_length=10, choices=[('Win', 'Win'), ('Loss', 'Loss')], default='Win')

    def __str__(self):
        return f"Game: {self.user.username} vs {self.opponent}"

# Tournament

class Player(models.Model): 
    name = models.CharField(max_length=100)
    avatar = models.CharField(max_length=200, default=GenerateDefaultImagePath)

    def __str__(self):
        return self.name

class Match(models.Model):
    player1 = models.ForeignKey(Player, related_name="match_player1", on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name="match_player2", on_delete=models.CASCADE)
    winner = models.ForeignKey(Player, related_name="match_winner", null=True, blank=True, on_delete=models.SET_NULL)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.player1} vs {self.player2} - Winner {self.winner}"

class LocalTournamentManager(models.Manager):

    def tournament_list(self, user):
        """ Return a list of all tournaments """

        tournaments = self.filter(user=user)

        tournament_list = list(tournaments)

        return tournament_list


    def add_player(self, data):
        playersList = []
        for player in data:
            playersList.append(Player.objects.create(name=player.name, score=player.score))
        print(">><< ", playersList)
        return playersList

class LocalTournament(models.Model):
    key = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, related_name='local_tournament', on_delete=models.CASCADE)
    players = models.ManyToManyField(Player)
    champion = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_champion')
    matchs = models.ManyToManyField(Match)

    objects = LocalTournamentManager()

    def __str__(self):
        return f"Tournament key : {self.key}"