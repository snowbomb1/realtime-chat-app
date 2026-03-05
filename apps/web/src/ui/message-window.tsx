import { Avatar, Box, Card, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useChat } from "../utils/ChatContext";
import { useSocket } from "../utils/SocketContext";

export const MessageWindow = ({ isMobile }: { isMobile: boolean }) => {
    const { username } = useSocket();
    const { typingUsers, messages } = useChat();
    const feedRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Box ref={feedRef} sx={{ p: 2, overflow: "auto", flex: 1, pb: isMobile ? '72px' : 2 }}>
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
                                <Card sx={{ p: 1, marginBottom: 2, width: isMobile ? 200 : 300 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Box sx={{ 
                                            display: "flex", 
                                            flexDirection: "column", 
                                            alignItems: isOwnMessage ? "flex-end" : "flex-start",
                                            mb: 1
                                        }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {message.username}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {message.timestamp}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ textAlign: isOwnMessage ? 'left' : 'right' }} variant="body1">
                                            {message.message}
                                        </Typography>
                                    </Box>
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