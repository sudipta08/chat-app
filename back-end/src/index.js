const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('connected');

    //welcome message for any user who joins the chat
    socket.emit('messageFromServer', 'Welcome');

    //notify others if a new user joins the chat
    socket.broadcast.emit('messageFromServer', 'A new user has joined');

    //notify about incoming message to all the connected clients
    socket.on('messageFromClient', (message, cb) => {
        io.emit('messageFromServer', message);
        cb('Message shared');//acknowleding that the message was received from client and shared with others
    });

    //notify about the user's location
    socket.on('locationFromClient', ({latitude, longitude}, cb) => {
        io.emit('locationFromServer', 'https://google.com/maps?q=' + latitude + ',' + longitude);
        cb('Location shared');//acknowleding that the location was received from client and shared with others
    });

    //notify others if any user leaves the application
    socket.on('disconnect', () => {
        io.emit('messageFromServer', 'A user has disconnected');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log('Server listening on port', port));