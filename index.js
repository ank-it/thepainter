var express = require('express');
var app = express();
app.use(express.static('public')); 
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var game = require('./GameEngine/index.js');


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get( '/*' , function( req, res, next ) {
	var file = req.params[0]; 
	//console.log('\t :: Express :: file requested : ' + file);
	res.sendfile( __dirname + '/' + file );
}); 



var server = http.listen(port, function() {
    console.log('listening on : ' + port);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('client connected');
    game.initGame(io, socket);
});
