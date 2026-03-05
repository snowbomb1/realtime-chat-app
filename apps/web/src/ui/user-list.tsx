import { Box, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, overflow: "auto" }}>
                <Typography
                    sx={{ mb: 2, borderBottom: "1px solid", borderBottomColor: "divider", textAlign: "center" }}
                    variant="h4"
                >Users</Typography>
                <List>
                    {users.map((u) => {
                        return (
                            <ListItem key={u}>
                                <ListItemText primary={u} />
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </Drawer>
    )
}