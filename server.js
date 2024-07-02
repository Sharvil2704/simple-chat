const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (username) => {
        socket.username = username;
        socket.broadcast.emit('chat message', `${username} has joined the chat.`);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.username}: ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', `${socket.username} has left the chat.`);
    });
});

const port = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
