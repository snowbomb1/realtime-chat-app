import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { isRateLimited } from './utils/isRateLimited';
import { checkUser, registerUser } from './lib/actions';
import { createToken, isValidToken } from './utils/tokenSigning';
import { isMatchingHash } from './utils/hashing';

const CLIENT_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173' : 'https://realtime-chat-app-54pufk3kx-nathaniels-projects-f6634e58.vercel.app/';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
});

const app = express();
app.set('trust proxy', 1)
app.use(cors({ origin: CLIENT_URL }));
app.use(limiter);
app.use(helmet());
app.use(express.json())
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL }
});

const roomUsers = new Map<string, Set<string>>();
const messageTimestamps = new Map<string, number[]>();

app.post('/auth/login', async (req, res) => {
    const username = req.body.username;
    const pass = req.body.password;
    if (!pass || !username) return res.status(400).json({ error: "Missing params" });
    const cleanUser = sanitizeHtml(username, { allowedTags: [], allowedAttributes: {} });
    const cleanPass = sanitizeHtml(pass, { allowedTags: [], allowedAttributes: {} });
    if (!cleanUser.trim() || !cleanPass.trim()) return;
    const { exists, user, error } = await checkUser(username, true);
    if (error) return res.status(400).json({ error: error });
    if (!exists || !user) return res.status(404).json({ error: "User not registered" });
    const validPass = await isMatchingHash(pass, user.passHash);
    if (!validPass) return res.status(400).json({ error: "Invalid password" })
    const token = createToken(user?.id, user?.username);
    res.json({ token, username, id: user.id });
});

app.post('/auth/register', async (req, res) => {
    const username = req.body.username;
    const pass = req.body.password;
    if (!pass || !username) return res.status(400).json({ error: "Missing params" });
    const cleanUser = sanitizeHtml(username, { allowedTags: [], allowedAttributes: {} });
    const cleanPass = sanitizeHtml(pass, { allowedTags: [], allowedAttributes: {} });
    if (!cleanUser.trim() || !cleanPass.trim()) return;
    const { exists, user, error } = await checkUser(username, false);
    if (exists) return res.status(400).json({ error: "Username already taken" });
    const register = await registerUser(username, pass);
    if (register.error || !register.user) return res.status(400).json({ error: "Failed to register, try again" });
    const token = createToken(register.user.id, username);
    res.json({ token, username, id: register.user.id });
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
    const names = Array.from(roomUsers.get(roomId) ?? []);
    res.json({ users: names });
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token missing"));
    const isValid = isValidToken(token);
    if (!isValid) return next(new Error("Invalid token"));
    socket.data.username = isValid?.username;
    socket.data.userId = isValid?.id;
    socket.data.token = token;
    next();
});

io.on("connection", (socket) => {
    const id = socket.id;
    const username = socket.data.username;

    socket.onAny((event, data) => {
        console.log('incoming event:', event, data);
    });
    socket.on("room:create", (data) => {
        if (!data?.room) return;
        const clean = sanitizeHtml(data.room, { allowedTags: [], allowedAttributes: {} });
        if (!clean.trim()) return;
        socket.data.room = data.room;
        const room = data.room;
        roomUsers.set(room, new Set([username]));
        socket.join(data.room)
        io.emit('room:list', [...roomUsers.keys()]);
    });
    socket.on("room:join", (data) => {
        if (!data?.room) return;
        const clean = sanitizeHtml(data.room, { allowedTags: [], allowedAttributes: {} });
        if (!clean.trim()) return;
        socket.data.room = data.room;
        roomUsers.get(data.room)?.add(username)
        io.to(data.room).emit('room:users', Array.from(roomUsers.get(data.room) ?? []));
        io.to(data.room).emit('message:new', {
            id: uuid(),
            username: 'system',
            message: `${username} joined the chat`,
            timestamp: Date.now(),
            type: 'system'
        });
        socket.join(data.room)
    });
    socket.on("room:leave", () => {
        const room = socket.data.room;
        roomUsers.get(room)?.delete(username);
        socket.leave(room);
        if (roomUsers.get(room)?.size === 0) {
            roomUsers.delete(room);
            io.emit('room:list', [...roomUsers.keys()]);
        } else {
            io.to(room).emit('message:new', {
                id: uuid(),
                username: 'system',
                message: `${username} left the chat`,
                timestamp: Date.now(),
                type: 'system'
            });
            io.to(room).emit('room:users', Array.from(roomUsers.get(room) ?? []));
        }
    });
    socket.on('user:join', () => {
        socket.emit('room:list', [...roomUsers.keys()])
    });
    socket.on("disconnect", () => {
        messageTimestamps.delete(id);
    });
    socket.on('typing:start', () => {
        const room = socket.data.room;
        socket.broadcast.to(room).emit('typing:update', { username: username, isTyping: true });
    });

    socket.on('typing:stop', () => {
        const room = socket.data.room;
        socket.broadcast.to(room).emit('typing:update', { username: username, isTyping: false });
    });
    socket.on("message:send", (data) => {
        const room = socket.data.room;
        if (!data.message) return;
        if (data.message.length > 500) return;
        if (isRateLimited({socketId: id, messageTimestamps})) {
            socket.emit('error', { message: 'You are sending messages too fast' });
            return;
        }
        const clean = sanitizeHtml(data.message, { allowedTags: [], allowedAttributes: {} });
        if (!clean.trim()) return;
        io.to(room).emit('message:new', {
            id: data.id,
            username: username,
            message: data.message,
            timestamp: Date.now(),
            avatarColor: data.avatarColor
        })
    });
});

server.listen(3000, () => {
    console.log('server running on port 3000')
});