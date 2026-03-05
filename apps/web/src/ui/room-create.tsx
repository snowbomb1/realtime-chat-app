import { Drawer, Input, Box, Button, Typography } from "@mui/material";
import { useChat } from "../utils/ChatContext";
import { useState } from "react";

interface RoomCreateProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export const RoomCreate = ({ isMobile, isOpen, onClose }: RoomCreateProps) => {
    const { handleCreateRoom } = useChat();
    const [room, setRoom] = useState<string>("");

    return (
        <Drawer
            sx={{ width: isMobile ? "auto" : 300, height: 300 }}
            anchor={isMobile ? "bottom" : "left"}
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
                <Typography
                    sx={{ mb: 5, borderBottom: "1px solid", borderBottomColor: "divider", textAlign: "center" }}
                    variant="h4"
                >Create a room</Typography>
                <Input
                    value={room}
                    onChange={({ target }) => setRoom(target.value)}
                    placeholder="Enter a room name"
                />
                <Button
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                    disabled={room.length < 5}
                    onClick={() => {
                        handleCreateRoom(room)
                        onClose();
                    }}>Create</Button>
            </Box>
        </Drawer>
    )
}