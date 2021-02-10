const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();
const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running in port 8000');
});

//podpinamy do serwera sockety
const io = socket(server);
io.on('connection', (socket) => {
  //wysłanie do wybranego clienta
  //podłączenemu clientowi odświeży się lista tasków
  io.to(socket.id).emit('updateData', tasks);
  //  socket.emit('updateData', tasks);
  console.log('New client! Its id – ' + socket.id);

  socket.on('addTask', (task) => {
    tasks.push(task);
    console.log(tasks);
    socket.broadcast.emit('addTask', task);
  });

    socket.on('removeTask', (id) => {
    const itemArr = tasks.indexOf(id);
    tasks.splice(itemArr, 1);
    socket.broadcast.emit('removeTask', id);
    console.log(tasks);
    });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
