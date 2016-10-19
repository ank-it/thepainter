var Game = require('./game.js');
var io;
var gameSocket;
var games = [];
/**
 * 
 */

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // // Host Events
    gameSocket.on('newgame', createNewGame);
    gameSocket.on('allgames', getAllGames);
    gameSocket.on('acquiresquare', acquireSquare);
    // gameSocket.on('hostCountdownFinished', hostStartGame);
    // gameSocket.on('hostNextRound', hostNextRound);

    // // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
}


function createNewGame(data) {
    // Create a unique Socket.IO Room
    var game = new Game(data.rows, data.columns, data.nickname);
    this.emit('newgame', {game: game, mySocketId: this.id});

    games.push(game);

    // Join the Room and wait for the players
    this.join(game.gameId);
    this.emit('allgames', {games: games});
}

function getAllGames() {
  this.emit('allgames', {games: games});
}

function playerJoinGame(data) {
    //console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;
    // Look up the room ID in the Socket.IO manager object.
    var room = io.sockets.adapter.rooms[data.gameId];
    console.log('Room is : ', room);
    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);
        // Emit an event notifying the clients that the player has joined the room.
        var player = addUserTogame(data.gameId, data.nickname);
        console.log(games);
        gameSocket.emit('mydetails', player);
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

        //Check number of players in the game and start it
        var result = checkGameEligibility(data.gameId);
        if(result != false){
          io.sockets.in(data.gameId).emit('playgame', { result: result, rows:result.rows , columns: result.columns });
        }

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{ message: "This room does not exist."} );
    }
}

function addUserTogame(gameId, nickname) {
  for (var i = 0; i < games.length ; i++) {
    if(games[i].gameId == gameId){
      return games[0].addPlayer(nickname);
    }
  }
}

function checkGameEligibility(gameId) {
  for (var i = 0; i < games.length ; i++) {
    if(games[i].gameId == gameId){
      var state = games[i].checkPlayers();
      if (state == true) {
        return games[i];
      }
      return false;
    }
  }
  return false;
}

function acquireSquare(gameId, playerId, row, column) {

  console.log('Acquiring the square: ', gameId, playerId, row, column);
  for (var i = 0; i < games.length ; i++) {
    if(games[i].gameId == gameId){

      var checkGameState = games[i].checkGameStatus() ;
      if ( checkGameState == true ) {
        var grid = games[i].updateGridAndScore(row, column, playerId);
        console.log('Acquired: ', grid);
        io.sockets.in(gameId).emit('squareacquired', grid);
        io.sockets.in(gameId).emit('updatescore', { scores: games[i].getAllPlayers() });
      }
      else {
        io.sockets.in(gameId).emit('gameover', checkGameState);
      }
      
    }
  }
  
} 