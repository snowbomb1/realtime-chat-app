import { Box, Drawer, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useChat } from "../utils/ChatContext";

interface RoomListProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export const RoomList = ({ isMobile, isOpen, onClose }: RoomListProps) => {
    const { rooms, currentRoom, handleJoinRoom } = useChat();

    return (
        <Drawer
            anchor={isMobile ? "bottom" : "left"}
            sx={{ width: isMobile ? "auto" : 300, height: 300, p: 2 }}
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, overflow: "auto" }}>
                <Typography
                    sx={{ mb: 2, borderBottom: "1px solid", borderBottomColor: "divider", textAlign: "center" }}
                    variant="h4"
                >Available Rooms</Typography>
                <List>
                    {rooms.map((r) => {
                        return (
                            <ListItemButton
                                sx={{
                                    bgcolor: currentRoom === r ? blue[300] : "white",
                                    ":hover": {
                                        bgcolor: currentRoom !== r ? grey[200] : blue[300]
                                    }
                                }}
                                key={r}
                                disabled={r === currentRoom}
                                onClick={() => {
                                    handleJoinRoom(r)
                                    onClose();
                                }}
                            >
                                <ListItemText>{r}</ListItemText>
                            </ListItemButton>
                        )
                    })}
                </List>
            </Box>
        </Drawer>
    )
}