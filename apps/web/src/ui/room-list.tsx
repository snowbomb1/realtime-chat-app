import { ActionSheet } from "@snowbomb1/nova-ui";
import { useChat } from "../utils/ChatContext";

interface RoomListProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export const RoomList = ({ isMobile, isOpen, onClose }: RoomListProps) => {
    const { rooms, currentRoom, handleJoinRoom } = useChat();

    return (
        <ActionSheet
            isOpen={isOpen}
            position={isMobile ? "bottom" : "side"}
            onClose={onClose}
            title="Rooms"
            actions={rooms.map((r) => {
                return {
                    label: r,
                    onClick: () => handleJoinRoom(r),
                    disabled: r === currentRoom
                }
            })}
        />
    )
}