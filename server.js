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

let players = {}, count = 0;
class Player {
	constructor(x, y, i, username) {
		this.i = i;
		this.x = x;
		this.y = y;
		this.username = username;
	}
}

const jogadores = (obj) => {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}; 
 
io.on('connection', (client) => {
	let i = ++count; //assign number
    players['player'+i] = new Player(1, 1, i, ''); //create new player with empty username
    for( let player in players ) { //send initial update
		client.emit('listaPlayers', { player: players[player] });
		client.broadcast.emit('listaPlayers', { player: players[player] });
	}
	
	client.on('move', (message) => {
        console.log('movimento:'+message.direcao + ' player:' + message.meuPlayer);
		
		let newX = players['player' + message.meuPlayer].x;
		let newY = players['player' + message.meuPlayer].y;
		
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
			players['player' + message.meuPlayer].x = newX;
			players['player' + message.meuPlayer].y = newY;
			
			client.emit('update', { player: players['player' + message.meuPlayer] });
			client.broadcast.emit('update', { player: players['player' + message.meuPlayer] });
		} else {
			// Send collision event to the client
			client.emit('collision', { 
				player: players['player' + message.meuPlayer],
				objectType: gameMap.objectMap[newY][newX]
			});
		}
    })
	
	client.on('registrar', (message) => {
		console.log("registro " + i + 'tamanho:' + jogadores(players));
		players['player' + i].username = message.username;
        client.emit('registroOk', { player: players['player' + i] });
		client.username = 'player'+i;
	});
	
    client.on('disconnect', () => {
        if (client.username && players[client.username]) {
            console.log(`Player ${client.username} disconnected. Total players: ${jogadores(players)}`);
            const removedPlayer = players[client.username];
            delete players[client.username];
            client.broadcast.emit('remove', { 
                player: client.username,
                playerData: removedPlayer
            });
        } else {
            console.log('Unknown client disconnected');
        }
    })
});

server.listen(8080, () => {
    console.log('server is running on port 8080');
});
