const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('send_message', (data) => {
        io.emit('chat_message', { message: data.message});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

pool.connect((err, client) => {
    if (err) {
        console.error('Error connecting to pg db:', err);
        return;
    }
    client.on('notification', (msg) => {
        const payload = JSON.parse(msg.payload);
        io.emit('_chat_message', { message: payload.text });
    });
    client.query('LISTEN _chat_message');
});

const PORT = 3010;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));