const enums = require("../common/enums");
class Game {
    constructor()
    {
        this.players = [];// list of sockets
        this.scores = [0,0];
        this.gameStatus = 0;
        //ballDirection indicates from which player the ball is going
        this.ballDirection = 0;
        this.attacking = enums.position.UNDECIDED;
        this.defending = enums.position.UNDECIDED;
    }
    registerMove = (player,position) => {

    }
    concludeMove = () => {
        this.attacking = this.defending = enums.position.UNDECIDED;

        if(this.attacking == this.defending) {
            this.ballDirection = 1 - this.ballDirection;
        }
        else {
            this.scored(this.players[this.ballDirection]);
        }
    }
    scored = (player) => {

    }
}

module.exports = Game;