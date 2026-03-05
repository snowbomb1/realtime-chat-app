import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { useSocket } from "../utils/ChatContext";
import { Alert, Box, Snackbar } from "@mui/material";
import { MessageWindow } from "../ui/message-window";
import { Header } from "../ui/header";
import { MessageInput } from "../ui/message-input";
import { SideBar } from "../ui/sidebar";

interface Message {
    id: string;
    username: string;
    message: string;
    timestamp: string;
    type: 'user' | 'system'
    avatarColor: string;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function ChatPage() {
    const navigate = useNavigate();
    const { username, setUsername, socketRef } = useSocket();
    const [error, setError] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [rooms, setRooms] = useState<string[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const avatarColor = useMemo(() => {
        return stringToColor(username)
    }, [username])
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const getRooms = async () => {
            const response = await fetch("http://localhost:3000/rooms")
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            setRooms(data.rooms)
        };
        getRooms();
    }, []);

    useEffect(() => {
        socketRef.current?.on('message:new', (message) => {
            const localString = new Date(message.timestamp).toLocaleString();
            setMessages((prev) => [...prev, { ...message, timestamp: localString }]);
            if (message.username !== username) {
                const ctx = new AudioContext();
                const oscillator = ctx.createOscillator();
                const gain = ctx.createGain();
                oscillator.connect(gain);
                gain.connect(ctx.destination);
                oscillator.frequency.value = 440;
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            }
        });

        socketRef.current?.on('typing:update', ({ username, isTyping }) => {
            setTypingUsers(prev => 
                isTyping ? [...prev.filter(u => u !== username), username]
                        : prev.filter(u => u !== username)
            );
        });

        socketRef.current?.on('room:list', (roomList) => {
            setRooms(roomList);
        });

        socketRef.current?.on('error', ({ message }) => {
            setError(message);
        });

        return () => {
            socketRef.current?.off('message:new');
            socketRef.current?.off('typing:update');
            socketRef.current?.off('room:list');
            socketRef.current?.off('error');
        };
    }, []);

    const handleSubmit = useCallback((message: string) => {
        const newId = uuid();
        socketRef.current?.emit('message:send', { id: newId, user: username, room: currentRoom, message: message, type: 'user', avatarColor });
    }, [username, currentRoom]);

    const handleLogOut = useCallback(() => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setUsername("");
        navigate('/')
    }, [setUsername, navigate])

    const handleJoinRoom = useCallback((room: string) => {
        if (currentRoom?.length) {
            socketRef.current?.emit("room:leave", { room });
            setMessages([])
        }
        socketRef.current?.emit("room:join", { room })
        setCurrentRoom(room);
    }, [currentRoom])

    const handleCreateRoom = useCallback((room: string) => {
        if (currentRoom?.length) {
            socketRef.current?.emit("room:leave", { currentRoom });
            setMessages([])
        }
        socketRef.current?.emit("room:create", { room });
        setCurrentRoom(room);
    }, [currentRoom]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", height: '100vh', color: 'black', bgcolor: "background.paper" }}>
            {/* Header */}
            <Header logOut={handleLogOut} />
            {/* Chat Window*/}
            <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
                {/* Side Bar */}
                <SideBar rooms={rooms} 
                    currentRoom={currentRoom} 
                    onCreate={handleCreateRoom} 
                    onJoin={handleJoinRoom}
                />
                {/* Message area */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <MessageWindow messages={messages} typingUsers={typingUsers} username={username} />
                    <MessageInput socketRef={socketRef} typingRef={typingTimeoutRef} 
                        onSubmit={handleSubmit} disabled={!currentRoom?.length} 
                        currentRoom={currentRoom}
                    />
                </Box>
            </Box>
           <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={error.length > 0}
            onClose={() => setError("")}
            key={error}
            autoHideDuration={3000}
        >
            <Alert onClose={() => setError("")}
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
            >
                {error}
            </Alert>
        </Snackbar>
        </Box>
    )
}