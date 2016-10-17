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
    gameSocket.on('acquiresquare', acquireSquare);
    // gameSocket.on('hostCountdownFinished', hostStartGame);
    // gameSocket.on('hostNextRound', hostNextRound);

    // // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
}


function createNewGame(data) {
    // Create a unique Socket.IO Room
    var game = new Game();
    this.emit('newgame', {gameId: game.gameId, mySocketId: this.id});

    games.push(game);

    // Join the Room and wait for the players
    this.join(game.gameId);
    this.emit('allgames', {games: games});
}


function playerJoinGame(data) {
    //console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;
    console.log(data);
    console.log(io.sockets.adapter.rooms);
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

        console.log(games);
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{ message: "This room does not exist."} );
    }
}


function acquireSquare(data) {

  
} 