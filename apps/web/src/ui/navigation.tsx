import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box, Tab, Tabs } from "@mui/material";
import { Room, Person, Create } from '@mui/icons-material';
import { RoomList } from "./room-list";
import { UserList } from "./user-list";
import { useChat } from "../utils/ChatContext";
import { RoomCreate } from "./room-create";

export const Navigation = ({ isMobile }: { isMobile: boolean }) => {
    const { rooms, currentRoom } = useChat();
    const [value, setValue] = useState<number | false>(false);

    if (isMobile) {
        return (
            <>
                <Box sx={{ position: 'fixed', bottom: 0, width: 'calc(100vw - 16px)' }}>
                    <BottomNavigation showLabels value={value}
                        onChange={(_event, newValue) => setValue(newValue)}
                    >
                        <BottomNavigationAction disabled={!rooms.length} label="Rooms" icon={<Room />} />
                        <BottomNavigationAction disabled={!currentRoom?.length} label="Users" icon={<Person />} />
                        <BottomNavigationAction label="Create Room" icon={<Create />} />
                    </BottomNavigation>
                </Box>
                <RoomList isMobile={true} isOpen={value === 0} onClose={() => setValue(false)} />
                <UserList isMobile={true} isOpen={value === 1} onClose={() => setValue(false)} />
                <RoomCreate isMobile={true} isOpen={value === 2} onClose={() => setValue(false)} />
            </>
        )
    }

    return (
        <>
            <Box
                sx={{ display: "flex", flexDirection: "column", left: 0, width: 80,
                    pl: 1, borderRight: "1px solid", borderRightColor: "divider",
                    minWidth: 80, height: "100%"
                }}
            >
                <Tabs orientation="vertical" value={value} onChange={(_event, value) => setValue(value)}>
                    <Tab disabled={!rooms.length} label="Rooms" icon={<Room />} />
                    <Tab disabled={!currentRoom?.length} label="Users" icon={<Person />} />
                    <Tab label="Add Room" icon={<Create />} />
                </Tabs>
            </Box>
            <RoomList isMobile={false} isOpen={value === 0} onClose={() => setValue(false)} />
            <UserList isMobile={false} isOpen={value === 1} onClose={() => setValue(false)} />
            <RoomCreate isMobile={false} isOpen={value === 2} onClose={() => setValue(false)} />
        </>
    )
}