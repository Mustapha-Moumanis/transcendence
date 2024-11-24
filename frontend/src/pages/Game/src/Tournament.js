import Player from "./Player.js";
import Match from "./Match.js";

export default class Tournament {
    constructor(data){
        this.player1 = new Player(data.player1.name, data.player1.avatar);
        this.player2 = new Player(data.player2.name, data.player2.avatar);
        this.player3 = new Player(data.player3.name, data.player3.avatar);
        this.player4 = new Player(data.player4.name, data.player4.avatar);
        this.Match1 = new Match(this.player1, this.player2);
        this.Match2 = new Match(this.player3, this.player4);
        this.final;
    }
    getPlayerByName(name){
        if (this.player1.nameGetter() === name) return this.player1;
        if (this.player2.nameGetter() === name) return this.player2;
        if (this.player3.nameGetter() === name) return this.player3;
        if (this.player4.nameGetter() === name) return this.player4;
    }
}