'use srtrict';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var colour = '#';
    for (var i = 0; i < 6; i++ ) {
        colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}

function Player(name) {
  this.id = Math.random() * 1000;
  this.name = name;
  this.colour = getRandomColor();
  this.score = 0;
}

Player.prototype = {

	incrementScore: function() {
		this.score++;
	},

	getPlayerDetails: function() {
		return {
			id: this.id,
			name: this.name,
			colour: this.colour,
			score: this.score
		}
	}

};

// export the class
module.exports = Player;