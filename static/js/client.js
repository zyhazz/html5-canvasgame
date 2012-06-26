
var socket  = io.connect('http://192.168.0.101:8080');
var meuPlayer = 0;
function Player (x,y) {
    this.x = x;
    this.y = y;
}

var players = {};

socket.on('connect', function() {socket.send();
    console.log('Connected!');
	socket.emit('registrar', { });
});

socket.on('registroOk', function(msg) {
	console.log("registrado:" + msg.player.i);
	players["player" + msg.player.i] = new Player(msg.player.x, msg.player.y);
	meuPlayer = msg.player.i;
});

socket.on('update', function(msg) {
	players["player" + msg.player.i] = msg.player;
});

socket.on('listaPlayers', function(msg) {
	players["player" + msg.player.i] = new Player(msg.player.x, msg.player.y);
});

socket.on('remove', function(msg) {
	delete players[msg.player];
	console.log(msg.player);
});

socket.on('disconnect', function() {
    console.log('Disconnected!');
});
