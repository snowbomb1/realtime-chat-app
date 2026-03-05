import { Box, Button, IconButton, Input, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import type { Socket } from "socket.io-client";
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

interface MessageInputProps {
    socketRef: React.RefObject<Socket | null>;
    typingRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
    currentRoom: string | null;
    disabled: boolean;
    onSubmit: (message: string) => void;
}


export const MessageInput = ({ socketRef, typingRef, currentRoom, disabled, onSubmit }: MessageInputProps) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const [showPicker, setShowPicker] = useState(false);

    const handleSubmit = useCallback(() => {
        if (typingRef.current) clearTimeout(typingRef.current);
        socketRef.current?.emit('typing:stop', { room: currentRoom });
        onSubmit(newMessage);
        setNewMessage("");
    }, [newMessage, onSubmit])

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" gap={1}>
                <Input
                    fullWidth
                    inputProps={{ maxLength: 500 }}
                    value={newMessage} 
                    onChange={({ target }) => {
                        setNewMessage(target.value);
                        socketRef.current?.emit('typing:start', { room: currentRoom });

                        if (typingRef.current) clearTimeout(typingRef.current);
                        typingRef.current = setTimeout(() => {
                            socketRef.current?.emit('typing:stop', { room: currentRoom });
                        }, 1000);
                    }}
                    onKeyDown={(event) => {
                        if (!newMessage.length) return;
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    disabled={disabled}
                />
                <Box sx={{ position: 'relative' }}>
                    <IconButton onClick={() => setShowPicker(prev => !prev)}>
                        😀
                    </IconButton>
                    {showPicker && (
                        <Box sx={{ position: 'absolute', bottom: '48px', right: 0, zIndex: 1000 }}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </Box>
                    )}
                </Box>
                <Typography variant="caption" color={newMessage.length > 450 ? 'error' : 'text.secondary'}>
                    {newMessage.length}/500
                </Typography>
                <Button variant="contained"
                    onClick={handleSubmit}
                    disabled={!newMessage.length || disabled}
                    onKeyDown={(event) => {
                        if (!newMessage.length || disabled) return;
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                >Submit</Button>
            </Stack>
        </Box>
    )
}