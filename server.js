const { Server } = require("socket.io");
const express = require('express');
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const io = new Server(server);

// Game map data
const gameMap = {
    baseMap: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    objectMap: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 34, 0, 0, 0, 0, 34, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
};

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Add endpoint to get map data
app.get('/api/map', (req, res) => {
    res.json(gameMap);
});

let players = new Map();
class Player {
	constructor(x, y, i, username) {
		this.i = i;
		this.x = x;
		this.y = y;
		this.username = username;
	}
}

const jogadores = (map) => map.size;
 
io.on('connection', (client) => {
	const id = client.id;
    players.set('player-'+id, new Player(1, 1, id, '')); //create new player with empty username
    
    // Send complete list of players to all clients
    io.emit('listaPlayers', { players: Object.fromEntries(players) });
	
	client.on('move', (message) => {
        console.log('movimento:'+message.direcao + ' player:' + message.meuPlayer);
		
		let player = players.get('player-' + message.meuPlayer);
		let newX = player.x;
		let newY = player.y;
		
		if(message.direcao == 'left'){
			newX = Math.max(0, newX - 1);
		}
		if(message.direcao == 'right'){
			newX = Math.min(15, newX + 1);
		}
		if(message.direcao == 'up'){
			newY = Math.max(0, newY - 1);
		}
		if(message.direcao == 'down'){
			newY = Math.min(15, newY + 1);
		}

		// Check for collision with objects
		if (gameMap.objectMap[newY][newX] === 0) {
			player.x = newX;
			player.y = newY;
			
			client.emit('update', { player: player });
			client.broadcast.emit('update', { player: player });
		} else {
			// Send collision event to the client
			client.emit('collision', { 
				player: player,
				objectType: gameMap.objectMap[newY][newX]
			});
		}
    })
	
	client.on('registrar', (message) => {
		console.log("registro " + id + ' tamanho:' + players.size);
		let player = players.get('player-'+id);
		player.username = message.username;
        client.emit('registroOk', { player: player });
		client.username = 'player-'+id;
	});
	
    client.on('disconnect', () => {
        if (players.has('player-'+id)) {
            console.log(`Player ${id} disconnected. Total players: ${players.size}`);
            const removedPlayer = players.get('player-'+id);
            players.delete('player-'+id);
            
            io.emit('remove', { 
                player: 'player-'+id,
                playerData: removedPlayer
            });
            
            io.emit('listaPlayers', { players: Object.fromEntries(players) });
        } else {
            console.log('Unknown client disconnected');
        }
    })
});

server.listen(8080, () => {
    console.log('server is running on port 8080');
});
