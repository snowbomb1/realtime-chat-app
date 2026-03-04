import { useCallback, useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Card, Input, Button } from "@mui/material";
import { grey } from "@mui/material/colors";

interface SideBarProps {
    rooms: string[];
    currentRoom: string | null;
    onJoin: (room: string) => void;
    onCreate: (room: string) => void;
}

export const SideBar = ({ rooms, currentRoom, onJoin, onCreate }: SideBarProps) => {
    const [tab, setTab] = useState<number>(0)
    const [users, setUsers] = useState<string[]>([]);
    const [newRoom, setNewRoom] = useState<string>("");

    useEffect(() => {
        if (!currentRoom?.length) return;
        const getUsers = async () => {
            const response = await fetch(`http://localhost:3000/users/${currentRoom}`);
            if (!response.ok) return;
            const data = await response.json();
            setUsers(data.users)
        };
        getUsers();

        return () => {
            setUsers([]);
        }
    }, [currentRoom])

    const handleRoom = useCallback(() => {
        if (!newRoom.trim()) return;
        onCreate(newRoom);
        setNewRoom("");
    }, [newRoom, onCreate])

    return (
        <Box sx={{ width: "300px", minWidth: "300px", borderRight: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_event, value) => setTab(value)}>
                    <Tab label="Rooms" />
                    <Tab disabled={!currentRoom?.length} label="Users" />
                    <Tab label="Add Room" />
                </Tabs>
            </Box>
            {tab === 0 ? (
                <div>
                    {rooms.map((r) => {
                        return (
                            <Card key={r}
                                onClick={() => onJoin(r)}
                                sx={{ 
                                    bgcolor: currentRoom === r ? grey[200] : 'background.paper',
                                    ":hover": { cursor: "pointer", bgcolor: grey[100] }
                                }}
                            ><Typography>{r}</Typography></Card>
                        )
                    })}
                </div>
            ) : tab === 1 ? (
                <div>
                    {users.map((u) => {
                        return (
                            <Card key={u} ><Typography>{u}</Typography></Card>
                        )
                    })}
                </div>
            ) : (
                <div>
                    <Box>
                        <Input value={newRoom}
                            onChange={({ target }) => setNewRoom(target.value)}
                        />
                        <Button onClick={handleRoom}>Create</Button>
                    </Box>
                </div>
            )}
        </Box>
    )
}