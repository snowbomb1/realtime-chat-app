import { Drawer, List, ListItem } from "@mui/material";
import { useChat } from "../utils/ChatContext";

interface UserListProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export const UserList = ({ isMobile, isOpen, onClose }: UserListProps) => {
    const { users } = useChat();

    return (
        <Drawer
            sx={{ width: isMobile ? "auto" : 300, height: 300, p: 2 }}
            anchor={isMobile ? "bottom" : "left"}
            open={isOpen}
            onClose={onClose}
        >
            <List>
                {users.map((u) => {
                    return (
                        <ListItem key={u}>{u}</ListItem>
                    )
                })}
            </List>
        </Drawer>
    )
}