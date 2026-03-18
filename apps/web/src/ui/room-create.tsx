import { useChat } from "../utils/ChatContext";
import { useState } from "react";
import { Container, Header, Modal, Box, Input, Button } from "@snowbomb1/nova-ui";

interface RoomCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RoomCreate = ({ isOpen, onClose }: RoomCreateProps) => {
    const { handleCreateRoom } = useChat();
    const [room, setRoom] = useState<string>("");

    const handleClose = () => {
        setRoom("");
        onClose();
    }

    return (
        <Modal
            size="m"
            isVisible={isOpen}
            onClose={handleClose}
            header={<Header variant="h3">Create Room</Header>}
            footer={
                <Box direction="horizontal">
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button disabled={room.length < 5} onClick={() => {
                        handleCreateRoom(room)
                        handleClose();
                    }}>Create</Button>
                </Box>
            }
        >
            <Container fullWidth>
                <Box>
                    <Input label="Room name"
                        error={room.length > 2 && room.length < 5 ? "Room name not long enough" : undefined}
                        helperText="Room name must be at least 5 characters"
                        value={room} onChange={setRoom}
                    />
                </Box>
            </Container>
        </Modal>
    )
}