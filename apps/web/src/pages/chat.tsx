import { AppLayout, Box, FloatingButton, Header, TopNav, Toast } from "@snowbomb1/nova-ui";
import { MessageWindow } from "../ui/message-window";
import { MessageInput } from "../ui/message-input";
import { useChat } from "../utils/ChatContext";
import { Navigation } from "../ui/navigation";
import { useEffect, useState } from "react";


export default function ChatPage() {
    const { error, handleClearError, currentRoom  } = useChat();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    const toggleSidenav = () => {
        setIsOpen(!isOpen)
    }

    return (
        <AppLayout
            topNav={<TopNav header={<Header variant='h2'>Nova Chat {currentRoom ? `- ${currentRoom}` : undefined}</Header>} />}
            sideNav={<Navigation isMobile={isMobile} isOpen={isOpen} onToggle={toggleSidenav} />}
            >
            <FloatingButton onClick={toggleSidenav} variant='menu' ariaLabel='Component menu' />
                <Box>
                    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', width: '100%', maxHeight: "60vh" }}>
                        <MessageWindow isMobile={isMobile} />
                    </div>
                    <MessageInput isMobile={isMobile} />
                </Box>
            <Toast
                visible={error !== null}
                onDismiss={handleClearError}
                status="error"
            >
                {error}
            </Toast>
        </AppLayout>
    )
}