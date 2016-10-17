
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Constructor
function Player(id) {
  // always initialize all instance properties
  this.id = id;
  this.colour = getRandomColor();
}


// class methods
Player.prototype = {

};

// export the class
module.exports = Player;