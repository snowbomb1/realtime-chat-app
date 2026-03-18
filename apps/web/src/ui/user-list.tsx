import { ActionSheet } from "@snowbomb1/nova-ui";
import { useChat } from "../utils/ChatContext";

interface UserListProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export const UserList = ({ isMobile, isOpen, onClose }: UserListProps) => {
    const { currentRoom, users } = useChat();

    return (
        <ActionSheet
            isOpen={isOpen}
            position={isMobile ? "bottom" : "side"}
            onClose={onClose}
            title={`${currentRoom} Users`}
            actions={users.map((u) => {
                return {
                    label: u,
                    onClick: () => null,
                    disabled: true
                }
            })}
        />
    )
}