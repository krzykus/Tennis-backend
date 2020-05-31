const enums = require("../common/enums");
class Game {
    constructor()
    {
        this.players = [];// list of sockets
        this.scores = [0,0];
        this.gameStatus = enums.gameStatus.NOTSTARTED;
        //ballDirection indicates from which player the ball is going (who is the "attacker")
        this.ballDirection = 0;
        this.attacking = enums.position.UNDECIDED;
        this.defending = enums.position.UNDECIDED;
    }
    startGame = () => {
        this.gameStatus = enums.gameStatus.INPROGRESS;
    }
    registerMove = (player,position) => {
        if(this.gameStatus !== enums.gameStatus.INPROGRESS)
            return {move:this.gameStatus,serving:this.ballDirection};
        let index = this.players.indexOf(player);
        if(this.ballDirection==index)
            this.attacking = position;
        else
            this.defending = position;
        return {move:this.concludeMove(),serving:this.ballDirection};
    }
    concludeMove = () => {
        if(this.attacking==enums.position.UNDECIDED || this.defending==enums.position.UNDECIDED)
            return enums.moveStatus.AWAITING;

        let scored = enums.moveStatus.CONTINUE;
        if(this.attacking == this.defending)
            this.ballDirection = 1 - this.ballDirection;
        else
            scored = this.scored(this.players[this.ballDirection],this.ballDirection);
            
        this.attacking = this.defending = enums.position.UNDECIDED;
        return scored;
    }
    scored = (player,index) => {
        this.scores[index]++;
        if(this.scores[index]===5 || (this.scores[index]===4 && this.scores[1-index]<=2))
        {
            this.gameStatus = enums.gameStatus.FINISHED
            return enums.moveStatus.FINISHED;
        }
        else if(this.scores[index]===4 && this.scores[1-index]===4)
        {
            //set the score to 40-40 as both players had A 
            this.scores[0] = this.scores[1] = 3;
        }
        return enums.moveStatus.SCORED
    }
}

module.exports = Game;