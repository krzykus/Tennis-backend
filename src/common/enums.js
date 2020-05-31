const position = {
    LEFT: 'Left',
    RIGHT: 'Right',
    UNDECIDED: 'Undecided'
}
const moveStatus = {
    AWAITING: 'Awaiting move',
    CONTINUE: 'Continue',
    SCORED: 'Scored',
    FINISHED: 'Finished',
}
const gameStatus = {
    INPROGRESS: "In Progress",
    FINISHED: "Finished"
}
const socketEvents = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    ABANDONED: "abandoned",
    NEWGAME: "new game",
    NEWPLAYER: "new player",
    GAMESTARTED: "game started",
    CREATED: "joined",
    MOVEMADE: "move made",
    MOVESTATE: "move state"
}
module.exports = {
    position,
    moveStatus,
    gameStatus,
    socketEvents
}