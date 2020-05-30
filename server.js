
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

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log(socket);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on('new player', (username) => {
    if(socket.username) return;
    socket.username = username;
    console.log(games);
    if(games.length==0 || games[games.length-1].players.length==2)
    {
        let newGame = new Game();
        newGame.players.push(socket);
        games.push(newGame);
        socket.emit("joined","Waiting for opponent");
    }
    else {
        let ongoingGame = games[games.length-1];
        ongoingGame.players.push(socket);
    }
  });
  socket.on('moved',(move) => {

  });
});


const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("Bump", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));