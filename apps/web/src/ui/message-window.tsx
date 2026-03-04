import { Avatar, Box, Card, Typography } from "@mui/material";
import type { Message } from "./types";
import { useEffect, useRef } from "react";

interface MessageWindowProps {
    username: string;
    typingUsers: string[];
    messages: Message[]
}

export const MessageWindow = ({ typingUsers, messages, username }: MessageWindowProps) => {
    const feedRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Box ref={feedRef} sx={{ p: 2, overflow: "auto", flex: 1 }}>
            {messages.map((message) => {
                const isSystem = message.type === "system"
                const isOwnMessage = message.username === username
                return (
                    <Box key={message.id} sx={{ display: "flex",
                        flexDirection: "row",
                        justifyContent: isSystem ? 'center' : isOwnMessage ? 'flex-end' : 'flex-start'
                    }}>
                        {!isSystem ? (
                            <Box sx={{
                                display: "flex" ,alignItems: "flex-start",
                                gap: 1,
                                flexDirection: isOwnMessage ? "row-reverse" : "row" 
                            }}>
                                <Avatar sx={{mt: 1, backgroundColor: message.avatarColor }}>{message.username.slice(0, 1)}</Avatar>
                                <Card sx={{ padding: 1, marginBottom: 5, width: "400px" }}>
                                    <h4 style={{ display: "flex", flexDirection: "row", gap: 6, alignItems: 'center'}}>{message.username} - {message.timestamp}</h4>
                                    <p>{message.message}</p>
                                </Card>
                            </Box>
                        ) : (
                            <p>{message.message} - {message.timestamp}</p>
                        )}
                    </Box>
                )
            })}
            {typingUsers.length > 0 && (
                <Typography variant="caption" sx={{ px: 2, pb: 1 }} color="text.secondary">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Typography>
            )}
        </Box>
    )
} 