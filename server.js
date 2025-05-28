const { Server } = require("socket.io");
const express = require('express');
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let players = {}, count = 0;
class Player {
	constructor(x, y, i) {
		this.i = i;
		this.x = x;
		this.y = y;
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
    players['player'+i] = new Player( 1, 1, i ); //create new player 
    for( let player in players ) { //send initial update
		client.emit('listaPlayers', { player: players[player] });
		client.broadcast.emit('listaPlayers', { player: players[player] });
	}
	
	client.on('move', (message) => {
        console.log('movimento:'+message.direcao + ' player:' + message.meuPlayer);
		
		if(message.direcao == 'left'){
			if(players['player' + message.meuPlayer].x > 0){
				players['player' + message.meuPlayer].x = players['player' + message.meuPlayer].x - 1;
			}
		}
		if(message.direcao == 'right'){
			if(players['player' + message.meuPlayer].x < 15){
				players['player' + message.meuPlayer].x = players['player' + message.meuPlayer].x + 1;
			}
		}
		if(message.direcao == 'up'){
			if(players['player' + message.meuPlayer].y > 0){
				players['player' + message.meuPlayer].y = players['player' + message.meuPlayer].y - 1;
			}
		}
		if(message.direcao == 'down'){
			if(players['player' + message.meuPlayer].y < 15){
				players['player' + message.meuPlayer].y = players['player' + message.meuPlayer].y + 1;
			}
		}
		
		client.emit('update', { player: players['player' + message.meuPlayer] });
		client.broadcast.emit('update', { player: players['player' + message.meuPlayer] });
    })
	
	client.on('registrar', (message) => {
		console.log("registro " + i + 'tamanho:' + jogadores(players));
        client.emit('registroOk', { player: players['player' + i] });
		client.username = 'player'+i;
    });
	
    client.on('disconnect', () => {
		console.log('desconectado cliente ' + client.username);
		delete players[client.username];
		client.broadcast.emit('remove', { player: client.username });
    })
});

server.listen(8080, () => {
    console.log('server is running on port 8080');
});
