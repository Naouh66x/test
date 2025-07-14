const socket = io();

document.getElementById('add-character').onsubmit = (e) => {
  e.preventDefault();
  const nom = document.getElementById('nom').value;
  const race = document.getElementById('race').value;
  const classe = document.getElementById('classe').value;
  const niveau = parseInt(document.getElementById('niveau').value);
  const pv = parseInt(document.getElementById('pv').value);
  socket.emit('addCharacter', { nom, race, classe, niveau, pv });
  e.target.reset();
};

socket.on('updateCharacters', (personnages) => {
  const list = document.getElementById('list-personnages');
  list.innerHTML = '';
  personnages.forEach((p) => {
    list.innerHTML += `
      <div class="p-2 bg-gray-700 rounded">
        <strong>${p.nom}</strong> (Niv. ${p.niveau})<br/>
        ${p.race} - ${p.classe}<br/>
        PV: ${p.pv}
      </div>
    `;
  });
});

function rollDice() {
  const type = parseInt(document.getElementById('dice-type').value);
  const count = parseInt(document.getElementById('dice-count').value);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(1 + Math.floor(Math.random() * type));
  }
  const resultText = `Résultat : ${results.join(', ')}`;
  document.getElementById('dice-result').textContent = resultText;
  socket.emit('newMessage', { user: 'MJ', message: `a lancé ${count}d${type} : ${results.join(', ')}` });
}

document.getElementById('chat-form').onsubmit = (e) => {
  e.preventDefault();
  const user = document.getElementById('chat-user').value;
  const message = document.getElementById('chat-input').value;
  socket.emit('newMessage', { user, message });
  document.getElementById('chat-input').value = '';
};

socket.on('newMessage', ({ user, message }) => {
  const chat = document.getElementById('chat-messages');
  const now = new Date();
  chat.innerHTML += `<div><b>[${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}] ${user} :</b> ${message}</div>`;
  chat.scrollTop = chat.scrollHeight;
});