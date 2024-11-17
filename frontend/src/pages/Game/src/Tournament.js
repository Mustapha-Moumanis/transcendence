import Player from "./Player.js";
import Match from "./Match.js";

export default class Tournament {
    constructor(names){
        this.player1 = new Player(names[0]);
        this.player2 = new Player(names[1]);
        this.player3 = new Player(names[2]);
        this.player4 = new Player(names[3]);
        this.Match1 = new Match(this.player1.nameGetter(), this.player2.nameGetter());
        this.Match2 = new Match(this.player3.nameGetter(), this.player4.nameGetter());
        this.final;
    }
}