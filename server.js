
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4000;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);
const enums = require("./src/common/enums");
const Game = require("./src/helpers/GameHelper");
const games = [];


let interval;

io.on(enums.socketEvents.CONNECTION, (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on(enums.socketEvents.DISCONNECT, () => {
    let abandoned = games.filter(game => {
      let index = game.players.indexOf(socket);
      if(index!==-1) {
        let opponent = game.players[1-index];
        if(opponent)
          opponent.emit(enums.socketEvents.ABANDONED,{opponent:socket.username});
        return true;
      }
      else 
        return false;
    })
    //TODO clear the game
    console.log("Client disconnected");
    clearInterval(interval);
  });

  //when other player disconnects create a new game
  socket.on(enums.socketEvents.NEWGAME, () => {
    //TODO
  });

  //new player joins the game
  socket.on(enums.socketEvents.NEWPLAYER, username => {
    if(socket.username) return;
    socket.username = username;
    //if either there's no games or all games are full then create new one
    if(games.length==0 || games[games.length-1].players.length==2)
    {
        let newGame = new Game();
        newGame.players.push(socket);
        games.push(newGame);
        socket.emit(enums.socketEvents.CREATED,"Waiting for opponent");
    }
    else {//join existing game
        let ongoingGame = games[games.length-1];
        ongoingGame.players.push(socket);
        ongoingGame.players.forEach(player => {
          player.emit(enums.socketEvents.GAMESTARTED,"Make a move");
        })
    }
  });

  //player made a move
  socket.on(enums.socketEvents.MOVEMADE,(move) => {
    let currentGame = getGameByPlayer(socket);
    let outcome = currentGame.registerMove(socket,move);
    currentGame.players.forEach(player => {
      player.emit(enums.socketEvents.MOVESTATE,{outcome:outcome, scores:currentGame.scores});
    });
  });
});

const getGameByPlayer = socket => {
  let game = games.filter(game => {
    return game.players.indexOf(socket)!==-1;
  })
  return game[0];
}
const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("Bump", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));