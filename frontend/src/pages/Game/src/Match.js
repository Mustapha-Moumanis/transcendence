export default class Match {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.winner_name;
        this.player1_score;
        this.player2_score;
    }

    player1NameGetter() {
        return this.player1.nameGetter();
    }
    player2NameGetter() {
        return this.player2.nameGetter();
    }
    player1ScoreGetter() {
        return this.player1_score;
    }
    player2ScoreGetter() {
        return this.player2_score;
    }
}