import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Room, Person, Create } from '@mui/icons-material';
import { RoomList } from "./room-list";
import { UserList } from "./user-list";
import { useChat } from "../utils/ChatContext";
import { RoomCreate } from "./room-create";

export const Navigation = ({ isMobile }: { isMobile: boolean }) => {
    const { rooms, currentRoom } = useChat();
    const [value, setValue] = useState<number | null>(null);

    if (isMobile) {
        return (
            <>
                <Box sx={{ width: "100%", pb: 2 }}>
                    <BottomNavigation showLabels value={value}
                        onChange={(_event, newValue) => setValue(newValue)}
                    >
                        <BottomNavigationAction disabled={!rooms.length} label="Rooms" icon={<Room />} />
                        <BottomNavigationAction disabled={!currentRoom?.length} label="Users" icon={<Person />} />
                        <BottomNavigationAction label="Create Room" icon={<Create />} />
                    </BottomNavigation>
                </Box>
                {value === 0 && (
                    <RoomList
                        isMobile={true} isOpen={value === 0}
                        onClose={() => setValue(null)}
                    />

                )}
                {value === 1 && (
                    <UserList
                        isMobile={true} isOpen={value === 1}
                        onClose={() => setValue(null)}
                    />
                )}
                {value === 2 && (
                    <RoomCreate
                        isMobile={true} isOpen={value === 2}
                        onClose={() => setValue(null)}
                    />
                )}
            </>
        )
    }

    return (
        <div>

        </div>
    )
}