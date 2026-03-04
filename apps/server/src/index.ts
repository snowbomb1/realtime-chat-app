import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

const CLIENT_URL = 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CLIENT_URL }));
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL }
});

const userNames = new Map();
const roomUsers = new Map<string, Set<string>>();

app.get('/users', (req, res) => {
    const names = [...userNames.values()];
    res.json({ users: names })
});

app.get('/rooms', (req, res) => {
    const names = [...roomUsers.keys()];
    res.json({ rooms: names });
});

app.get('/users/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const sockets = roomUsers.get(roomId);
    if (!sockets) {
        res.json({ users: [] });
        return;
    }
    const names = Array.from(sockets).map(socketId => userNames.get(socketId));
    res.json({ users: names });
})

io.on("connection", (socket) => {
    const id = socket.id;
    socket.onAny((event, data) => {
        console.log('incoming event:', event, data);
    });
    socket.on("room:create", (data) => {
        if (!data?.room) return;
        const room = data.room;
        roomUsers.set(room, new Set([id]));
        socket.join(data.room)
        io.emit('room:list', [...roomUsers.keys()]);
    });
    socket.on("room:join", (data) => {
        if (!data?.room) return;
        const user = userNames.get(id)
        roomUsers.get(data.room)?.add(id)
        io.to(data.room).emit('message:new', {
            id: uuid(),
            username: 'system',
            message: `${user} joined the chat`,
            timestamp: Date.now(),
            type: 'system'
        });
        socket.join(data.room)
    });
    socket.on("room:leave", (data) => {
        if (!data?.room) return;
        const user = userNames.get(id);
        roomUsers.get(data.room)?.delete(id)
        if (roomUsers.get(data.room)?.size === 0) {
            roomUsers.delete(data.room);
            io.emit('room:list', [...roomUsers.keys()]);
        } else {
            io.to(data.room).emit('message:new', {
                id: uuid(),
                username: 'system',
                message: `${user} left the chat`,
                timestamp: Date.now(),
                type: 'system'
            });
        }
    });
    socket.on('user:join', (data) => {
        userNames.set(id, data.userName);
    });
    socket.on("disconnect", () => {
        userNames.delete(id);
    });
    socket.on('typing:start', (data) => {
        if (!data?.room) return;
        const user = userNames.get(id);
        const room = data.room;
        socket.broadcast.to(room).emit('typing:update', { username: user, isTyping: true });
    });

    socket.on('typing:stop', (data) => {
        if (!data?.room) return;
        const user = userNames.get(id);
        socket.broadcast.to(data.room).emit('typing:update', { username: user, isTyping: false });
    });
    socket.on("message:send", (data) => {
        if (!data?.room) return;
        const user = userNames.get(id);
        io.to(data.room).emit('message:new', {
            id: data.id,
            username: user,
            message: data.message,
            timestamp: Date.now(),
            avatarColor: data.avatarColor
        })
        console.log('message sent')
    });
});

server.listen(3000, () => {
    console.log('server running on port 3000')
});