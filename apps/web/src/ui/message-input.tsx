import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { useSocket } from "../utils/SocketContext";
import { useChat } from "../utils/ChatContext";

export const MessageInput = () => {
    const { socketRef } = useSocket();
    const { currentRoom, handleSendMessage } = useChat();
    const [newMessage, setNewMessage] = useState<string>("");
    const [showPicker, setShowPicker] = useState(false);
    const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        if (showPicker) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPicker]);

    const handleSubmit = useCallback(() => {
        if (typingRef.current) clearTimeout(typingRef.current);
        socketRef.current?.emit('typing:stop');
        handleSendMessage(newMessage);
        setNewMessage("");
    }, [newMessage, handleSendMessage])

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" gap={1}>
                <TextField
                    label="Message Input"
                    fullWidth
                    value={newMessage} 
                    onChange={({ target }) => {
                        setNewMessage(target.value);
                        socketRef.current?.emit('typing:start');

                        if (typingRef.current) clearTimeout(typingRef.current);
                        typingRef.current = setTimeout(() => {
                            socketRef.current?.emit('typing:stop');
                        }, 1000);
                    }}
                    onKeyDown={(event) => {
                        if (!newMessage.length) return;
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    disabled={!currentRoom?.length}
                />
                <Box sx={{ position: 'relative', display: "flex", flexDirection: "column-reverse", gap: 3 }}>
                    <IconButton onClick={() => setShowPicker(prev => !prev)}>
                        😀
                    </IconButton>
                    {showPicker && (
                        <Box ref={pickerRef}
                            sx={{
                                position: 'fixed',
                                bottom: { xs: '120px', sm: '80px' },
                                left: { xs: '50%', sm: 'auto' },
                                right: { xs: 'auto', sm: '16px' },
                                transform: { xs: 'translateX(-50%)', sm: 'none' },
                                zIndex: 1000,
                                width: 'min(350px, 95vw)',
                            }}
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                width="100%"
                                height={350}
                            />
                        </Box>
                    )}
                </Box>
                <Typography variant="caption" color={newMessage.length > 450 ? 'error' : 'text.secondary'}>
                    {newMessage.length}/500
                </Typography>
                <Button variant="contained"
                    onClick={handleSubmit}
                    disabled={!newMessage.length || !currentRoom?.length}
                    onKeyDown={(event) => {
                        if (!newMessage.length || !currentRoom?.length) return;
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                >Submit</Button>
            </Stack>
        </Box>
    )
}