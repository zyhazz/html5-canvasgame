var io = require('socket.io');
var socket = io.listen(8080);
socket.set('log level', 1);//tira mensagens chatas de debug
var players = {}, count = 0;
function Player (x, y, i) {
	this.i = i;
    this.x = x;
    this.y = y;
}

function jogadores(obj) { //quantos online (coisa feia)
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}; 
 
socket.on('connection', function(client){
    
	
	var i = ++count; //assign number
    players['player'+i] = new Player( 1, 1, i ); //create new player 
    for( var player in players ) { //send initial update
		client.emit('listaPlayers', { player: players[player] });
		client.broadcast.emit('listaPlayers', { player: players[player] });
	}
	
	client.on('move', function(message){
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
	
	client.on('registrar', function(message){
		console.log("registro " + i + 'tamanho:' + jogadores(players));
        client.emit('registroOk', { player: players['player' + i] });
		client.username = 'player'+i;

    });
	
    client.on('disconnect', function(){

		console.log('desconectado cliente ' + client.username);
		delete players[client.username];
		client.broadcast.emit('remove', { player: client.username });
    })
});
