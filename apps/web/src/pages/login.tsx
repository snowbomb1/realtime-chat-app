import { Container, Header, Input, Box, Button, Toast, AppLayout, TopNav } from '@snowbomb1/nova-ui';
import { useCallback, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketContext";
import { Registration } from "../ui/registration";
import { login, URL } from "../utils/apiCalls";
import { isValid } from "../utils/passwordValidation";

import '../wrapper.css'


export default function LoginPage() {
    const { username, setUsername, password, setPassword, socketRef } = useSocket();
    const [error, setError] = useState<string>("");
    const [registrationIsOpen, setRegistrationIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleModal = () => {
        setRegistrationIsOpen(!registrationIsOpen)
    }

    const handleJoin = (token: string) => {
        socketRef.current = io(URL, { auth: { token }});
        socketRef.current.on('connect', () => {
            socketRef.current?.emit('user:join');
            navigate("/chat");
        });
    }

    const handleLogin = useCallback(async () => {
        const response = await login(username, password)
        if ("error" in response) {
            setError(response.error);
            return;
        }
        localStorage.setItem("token", response.token);
        handleJoin(response.token);
    }, [username, password, navigate]);

    return (
        <AppLayout
            topNav={<TopNav header={<Header variant='h2'>Nova Chat</Header>} />}
        >
            <div className="appWrapper">
                <Container
                    variant="elevated"
                    padding="md"
                    header={
                        <Header variant="h2">Login</Header>
                    }
                    headerActions={
                        <Button variant="secondary" onClick={toggleModal}>Register</Button>
                    }
                    footer={
                        <Box position='center'>
                            <Button disabled={!isValid(password)} onClick={handleLogin}>Submit</Button>
                        </Box>
                    }
                >
                    <Box direction='vertical' position="center">
                        <Input hideClear label="Username" value={username} onChange={setUsername} />
                        <Input hideClear label="Password" type="password" value={password} onChange={setPassword} />
                    </Box>
                </Container>
                <Registration isOpen={registrationIsOpen} onClose={toggleModal} onRegister={handleJoin} />
                <Toast
                    visible={error?.length > 0}
                    onDismiss={() => setError("")}
                    position="top"
                    status="error"
                >
                    {error}
                </Toast>
            </div> 
        </AppLayout>
    )
}