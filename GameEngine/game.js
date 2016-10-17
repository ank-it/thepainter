// Constructor
function Game() {
  // always initialize all instance properties
  this.gameId = ( Math.random() * 100000 ) | 0;;
  this.players = []; 
}


// class methods
Game.prototype = {

	addPlayer : function(playerId) {
		this.players.push(playerId);
	},

	removePlayer: function(playerId) {
		this.players = this.players.filter( function(t){return t.id != playerId} );
	},

	sync: function() {

	} 

};

// export the class
module.exports = Game;