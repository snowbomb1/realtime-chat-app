import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { grey } from "@mui/material/colors";
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
            <List>
                {rooms.map((r) => {
                    return (
                        <ListItemButton
                            sx={{ bgcolor: currentRoom ? grey[400] : grey[100] }}
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
        </Drawer>
    )
}