import { useState } from "react";
import { SideNav } from "@snowbomb1/nova-ui";
import { MapPinIcon, UserIcon, PencilIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { RoomList } from "./room-list";
import { UserList } from "./user-list";
import { useChat } from "../utils/ChatContext";
import { RoomCreate } from "./room-create";

interface NavigationProps {
    isOpen: boolean;
    isMobile: boolean;
    onToggle: () => void;
}

export const Navigation = ({ isMobile, isOpen, onToggle }: NavigationProps) => {
    const { rooms, currentRoom, handleLogOut } = useChat();
    const [value, setValue] = useState<number | false>(false);

    return (
        <>
            <SideNav 
                isOpen={isOpen}
                onToggle={onToggle}
                position="left"
                items={[
                    { label: "Rooms", disabled: !rooms.length, icon: <MapPinIcon />, onClick: () => setValue(0) },
                    { label: "Users", disabled: !currentRoom?.length, icon: <UserIcon />, onClick: () => setValue(1) },
                    { label: "Create Room", type: "action", icon: <PencilIcon />, onClick: () => setValue(2) },
                    { label: "Logout", destructive: true, type: "action", icon: <ArrowLeftStartOnRectangleIcon />, onClick: handleLogOut }
                ]}
            />
            <RoomCreate isOpen={value === 2} onClose={() => setValue(false)} />
            <RoomList isMobile={isMobile} isOpen={value === 0} onClose={() => setValue(false)} />
            <UserList isMobile={isMobile} isOpen={value === 1} onClose={() => setValue(false)} />
        </>
    )
}