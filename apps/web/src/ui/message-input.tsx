import { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { TextArea, Box, Container, Button } from "@snowbomb1/nova-ui";
import { useSocket } from "../utils/SocketContext";
import { useChat } from "../utils/ChatContext";

export const MessageInput = ({ isMobile }: { isMobile: boolean}) => {
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
        <Container fullWidth>

            <Box direction={!isMobile ? "horizontal" : "vertical"}>
                <TextArea label="Message Input"
                    fullWidth
                    value={newMessage}
                    onChange={(value) => {
                        setNewMessage(value);
                        socketRef.current?.emit('typing:start');

                        if (typingRef.current) clearTimeout(typingRef.current);
                        typingRef.current = setTimeout(() => {
                            socketRef.current?.emit('typing:stop');
                        }, 1000);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            if (!newMessage.length) return;
                            handleSubmit();
                        }
                    }}
                    disabled={!currentRoom?.length}
                />
                <Button variant="icon" onClick={() => setShowPicker(prev => !prev)}>
                    😀
                </Button>
                <small color={newMessage.length > 450 ? 'var(--color-error)' : 'var(text-color-secondary)'}>
                    {newMessage.length}/500
                </small>
                <Button
                    onClick={handleSubmit}
                    disabled={!newMessage.length || !currentRoom?.length}
                    onKeyDown={(event) => {
                        if (!newMessage.length || !currentRoom?.length) return;
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                >Submit</Button>
            </Box>
            {showPicker && (
                <div style={{ zIndex: 1000 }}>
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        height={350}
                    />
                </div>
            )}
        </Container>
    )
}