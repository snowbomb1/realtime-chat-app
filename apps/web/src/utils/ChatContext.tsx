import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Message } from "../ui/types";
import { useSocket } from "./SocketContext";
import { v4 as uuid } from "uuid";
import { stringToColor } from "./stringToColor";
import { useNavigate } from "react-router-dom";

interface ChatContextType {
    rooms: string[];
    currentRoom: string | null;
    messages: Message[];
    users: string[];
    typingUsers: string[];
    error: string | null;
    avatarColor: string;
    handleClearError: () => void;
    handleJoinRoom: (room: string) => void;
    handleCreateRoom: (room: string) => void;
    handleSendMessage: (message: string) => void;
    handleLogOut: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);


export function ChatProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { socketRef, username, setUsername } = useSocket();
    const [rooms, setRooms] = useState<string[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const avatarColor = useMemo(() => {
        return stringToColor(username)
    }, [username])

    useEffect(() => {
        if (!socketRef.current) return;

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

        socketRef.current?.on('room:users', (userList) => {
            setUsers(userList)
        });

        socketRef.current?.on('room:list', (roomList) => {
            setRooms(roomList);
        });

        socketRef.current?.on('error', (data) => {
            setError(data.message);
        });

        return () => {
            socketRef.current?.off('message:new');
            socketRef.current?.off('typing:update');
            socketRef.current?.off('room:list');
            socketRef.current?.off('room:users');
            socketRef.current?.off('error');
        };
    }, [socketRef.current, currentRoom]);

    const handleJoinRoom = useCallback((room: string) => {
        if (currentRoom) socketRef.current?.emit('room:leave');
        socketRef.current?.emit('room:join', { room });
        setCurrentRoom(room);
        setMessages([]);
    }, [currentRoom, socketRef]);

    const handleCreateRoom = useCallback((room: string) => {
        if (currentRoom?.length) {
            socketRef.current?.emit("room:leave");
            setMessages([])
        }
        socketRef.current?.emit("room:create", { room });
        setCurrentRoom(room);
    }, [currentRoom]);

    const handleSendMessage = useCallback((message: string) => {
        const newId = uuid();
        socketRef.current?.emit('message:send', { id: newId, message: message, type: 'user', avatarColor });
    }, [username, currentRoom]);

    const handleLogOut = useCallback(() => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setUsername("");
        navigate('/')
    }, [setUsername, navigate])

    const handleClearError = useCallback(() => {
        setError(null)
    }, [])

    return (
        <ChatContext.Provider
            value={{ rooms, currentRoom, messages, users, typingUsers, error, avatarColor,
                handleJoinRoom, handleCreateRoom, handleSendMessage, handleLogOut,
                handleClearError
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}