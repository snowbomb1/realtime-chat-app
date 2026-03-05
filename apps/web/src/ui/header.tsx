import { Box, Button, Typography } from "@mui/material";
import { useChat } from "../utils/ChatContext";

export const Header = () => {
    const { handleLogOut, currentRoom } = useChat();

    return (
        <Box sx={{ display: "flex",
            flexDirection: "row", p: 2, 
            borderBottom: '1px solid',
            borderBottomColor: 'divider', 
            alignItems: 'center',
            gap: 4
        }}>
            {currentRoom && (
                <Typography variant="h4">{currentRoom}</Typography>
            )}
            <Button sx={{ marginLeft: "auto" }} onClick={handleLogOut}>Logout</Button>
        </Box>
    )
}