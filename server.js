const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let personnages = [];

io.on('connection', (socket) => {
  console.log('🔗 Un joueur s’est connecté');

  socket.emit('updateCharacters', personnages);

  socket.on('addCharacter', (perso) => {
    personnages.push(perso);
    io.emit('updateCharacters', personnages);
  });

  socket.on('newMessage', (data) => {
    io.emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Un joueur s’est déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🎲 Serveur lancé sur http://localhost:' + PORT);
});