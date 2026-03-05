import { Alert, Box, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import { MessageWindow } from "../ui/message-window";
import { Header } from "../ui/header";
import { MessageInput } from "../ui/message-input";
import { Navigation } from "../ui/navigation";
import { useChat } from "../utils/ChatContext";


export default function ChatPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { error, handleClearError  } = useChat();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", height: '100vh', color: 'black', bgcolor: "background.paper" }}>
            {/* Header */}
            <Header />
            {/* Chat Window*/}
            <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
                {/* Side Bar */}
                {/* <SideBar rooms={rooms} 
                    currentRoom={currentRoom} 
                    onCreate={handleCreateRoom} 
                    onJoin={handleJoinRoom}
                /> */}
                {/* Message area */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <MessageWindow isMobile={isMobile} />
                    <MessageInput />
                </Box>
            </Box>
            <Navigation isMobile={isMobile} />
           <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={error !== null}
            onClose={handleClearError}
            key={error}
            autoHideDuration={3000}
        >
            <Alert onClose={handleClearError}
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