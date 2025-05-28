var socket = io();
var meuPlayer = 0;
function Player(x, y, username) {
    this.x = x;
    this.y = y;
    this.username = username;
}

var players = {};

// Show username prompt on connection
socket.on('connect', function() {
    const username = prompt('Please enter your username:');
    if (username) {
        socket.emit('registrar', { username: username });
    } else {
        socket.emit('registrar', { username: 'Player' + Math.floor(Math.random() * 1000) });
    }
    console.log('Connected!');
});

socket.on('registroOk', function(msg) {
	console.log("registrado:" + msg.player.i);
	players["player" + msg.player.i] = new Player(msg.player.x, msg.player.y, msg.player.username);
	meuPlayer = msg.player.i;
});

socket.on('update', function(msg) {
	players["player" + msg.player.i] = msg.player;
});

socket.on('listaPlayers', function(msg) {
	players["player" + msg.player.i] = new Player(msg.player.x, msg.player.y, msg.player.username);
});

socket.on('remove', function(msg) {
	delete players[msg.player];
});

socket.on('disconnect', function() {
    console.log('Disconnected!');
});
