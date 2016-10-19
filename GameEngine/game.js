'use strict';

var Player = require('./player.js');

function initializeGrid(rows, columns) {
	var arr = [];
	for (var i = 0; i < rows; i++) {
		var temp = [];
		for (var j=0; j < columns; j++) {
			temp[j] = 0;
		}
		arr.push(temp);
	}
	return arr;
}


function Game(rows, columns, playerName) {
  this.gameId = ( Math.random() * 100000 ) | 0;
  this.rows = rows;
  this.columns = columns;
  this.totalCells = rows*columns;
  this.grid = initializeGrid(rows, columns);
  this.filledCells = 0;
  this.player = new Player(playerName);
  this.players = [this.player]; 
}

Game.prototype = {

	addPlayer : function(playerName) {
		var player = new Player(playerName)
		this.players.push(player);
		return player;
	},

	getAllPlayers: function() {
		return this.players;
	},

	removePlayer: function(playerId) {
		this.players = this.players.filter( function(t){return t.id != playerId} );
	},

	checkGameStatus: function() {
		if (this.filledCells < this.totalCells) 
			return true;
		else {
			var highest = 0;
			var playerName = '';
			for (var i = 0; i < this.players.length ; i++) {
				if (this.players[i].score > highest) {
					highest = this.players[i].score;
					playerName = this.players[i].name;
				}
			}
			return playerName;
		}
	},

	checkPlayers: function() {
		if (this.players.length >= 2) 
			return true;
		else
			return false;
	},

	updateGridAndScore: function(row, column, playerId) {

		for (var i = 0; i < this.players.length ; i++) {
			if (this.players[i].id == playerId) {

				if (this.grid[row][column] == 0 ) {
					this.players[i].incrementScore();
					this.filledCells++;
					this.grid[row][column] = this.players[i].colour;
				}
				console.log('Players score incremented !');
				return this.grid;
			}
		}
		return false;			
	}
}

// export the class
module.exports = Game;