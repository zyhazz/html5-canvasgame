var socket = io();
var meuPlayer = 0;
var storedUsername = sessionStorage.getItem('gameUsername'); // Store username in localStorage

function Player(x, y, username) {
    this.x = x;
    this.y = y;
    this.username = username;
}

var players = {};

// Show username prompt only on first connection
socket.on('connect', function() {
    if (!storedUsername) {
        const username = prompt('Please enter your username:');
        if (username) {
            storedUsername = username;
            localStorage.setItem('gameUsername', username);
        } else {
            storedUsername = 'Player' + Math.floor(Math.random() * 1000);
            localStorage.setItem('gameUsername', storedUsername);
        }
    }
    socket.emit('registrar', { username: storedUsername });
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
    // Clear existing players
    players = {};
    
    // Add all players from the received list
    for (let playerId in msg.players) {
        const player = msg.players[playerId];
        players[playerId] = new Player(player.x, player.y, player.username);
    }
});

socket.on('remove', function(msg) {
	delete players[msg.player];
});

socket.on('disconnect', function() {
    console.log('Disconnected!');
});
