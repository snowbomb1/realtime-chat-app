import { Container, Box } from "@snowbomb1/nova-ui";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import { useChat } from "../utils/ChatContext";
import { useSocket } from "../utils/SocketContext";

interface MessageWindowProps {
    isMobile: boolean;
}

export const MessageWindow = ({ isMobile }: MessageWindowProps) => {
    const { username } = useSocket();
    const { typingUsers, messages } = useChat();
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Container style={{ overflow: "auto" }} variant="elevated" ref={feedRef} fullWidth>
            {messages.map((message) => {
                const isSystem = message.type === 'system';
                const isOwnMessage = message.username === username;
                return (
                    <Box key={message.id} direction="horizontal" position={isSystem ? 'center' : isOwnMessage ? 'right' : 'left'}>
                        {!isSystem ? (
                            <Box reverse={isOwnMessage} direction="horizontal" position={isOwnMessage ? 'right' : 'left'}>
                                <UserCircleIcon width={40} color={message.avatarColor} style={{ marginTop: 4, flexShrink: 0 }} />
                                <Container style={{ maxWidth: isMobile ? 200 : 400, width: "100%" }} fullWidth padding="sm">
                                    <Box direction="vertical" position={isOwnMessage ? 'right' : 'left'}>
                                        <small>{message.username}</small>
                                        <small style={{ fontSize: 8 }}>{message.timestamp}</small>
                                    </Box>
                                    <p style={{ wordBreak: 'break-word', marginTop: '0.5rem' }}>{message.message}</p>
                                </Container>
                            </Box>
                        ) : (
                            <small style={{ color: 'var(--color-text-secondary)' }}>{message.message} - {message.timestamp}</small>
                        )}
                    </Box>
                );
            })}
            {typingUsers.length > 0 && (
                <small style={{ color: 'var(--color-text-secondary)', padding: '0 1rem' }}>
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </small>
            )}
        </Container>
    );
};