var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io'),
fs = require('fs-extra'),
users = {};

server.listen(3000, function() {
	console.log(new Date() + 'Server is running on port 3000');
});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var socket = io.listen(server);

socket.sockets.on('connection', function(socket) {

     socket.on('jardin', function(data, err) {
		 console.log("jardin :"+data);
	 });
     /////// envoi d'un fichier init
	var fijar = __dirname +'/jardata/fijarinit'
	var obj = JSON.parse(fs.readFileSync(fijar, 'utf8'));
  
	socket.emit('fijar', "Patienter... jardin en préparation.");

    //////////// enregistrement des modifs dans un fichier temp
    var fijartemp = __dirname +'/jardata/fijartemp'
    
	socket.on('modifijar0', function(data, err) {
		fs.writeFile(fijartemp, JSON.stringify(data), function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("fijartemp sauvegardé sur le serveur à :"+new Date());
			}
		});
	});
       //////////// sur demande envoi du dernier fichier temp
   	socket.on('rappel0', function(data, err) {
		 var tempobj = JSON.parse(fs.readFileSync(fijartemp, 'utf8'));
		 socket.emit('temp0', tempobj,"envoi de fijartemp par le serveur à :"+new Date());
	});
	

	console.log('quelqu un vient de  connecter à :'+new Date());

	socket.on('disconnect', function(){
		 console.log('déconnexion à :'+new Date());
		 
      });
		 

});
