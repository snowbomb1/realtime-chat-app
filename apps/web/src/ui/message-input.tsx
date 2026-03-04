import { Box, Button, Input, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import type { Socket } from "socket.io-client";

interface MessageInputProps {
    socketRef: React.RefObject<Socket | null>;
    typingRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
    currentRoom: string | null;
    disabled: boolean;
    onSubmit: (message: string) => void;
}


export const MessageInput = ({ socketRef, typingRef, currentRoom, disabled, onSubmit }: MessageInputProps) => {
    const [newMessage, setNewMessage] = useState<string>("");

    const handleSubmit = useCallback(() => {
        if (typingRef.current) clearTimeout(typingRef.current);
        socketRef.current?.emit('typing:stop', { room: currentRoom });
        onSubmit(newMessage);
        setNewMessage("");
    }, [newMessage, onSubmit])

    return (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" gap={1}>
                <Input
                    fullWidth 
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