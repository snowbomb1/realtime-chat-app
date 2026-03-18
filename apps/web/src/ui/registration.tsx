import { useCallback, useMemo, useState } from "react";
import { Header, Modal, Toast, Box, Button, Container, Input } from '@snowbomb1/nova-ui';
import { isValid } from "../utils/passwordValidation";
import { register } from "../utils/apiCalls";
import { PasswordHelperText } from "./password-helper";

interface RegistrationProps {
    isOpen: boolean;
    onRegister: (token: string) => void;
    onClose: () => void;
}

export const Registration = ({ isOpen, onRegister, onClose }: RegistrationProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const cleanup = () => {
        setUsername("");
        setPassword("");
        setError("");
    }

    const handleClose = () => {
        onClose();
    }


    const handleRegistration = useCallback(async () => {
        const response = await register(username, password)
        if ("error" in response) {
            setError(response.error);
            return;
        }
        localStorage.setItem("token", response.token);
        cleanup();
        onRegister(response.token);
    }, [username, password]);

    const isDisabled = useMemo(() => {
        if (username.length < 5) return true;
        if (!isValid(password)) return true;
        return false;
    }, [username, password]);

    return (
        <>
            <Modal
                isVisible={isOpen}
                onClose={handleClose}
                size='m'
                header={<Header variant="h2">User Registration</Header>}
                footer={
                    <Box position="center">
                        <Button disabled={isDisabled} onClick={handleRegistration}>Register</Button>
                    </Box>
                }
            >
                <Box>
                    <Container>
                        <Box>
                            <Input hideClear label="Username" value={username} onChange={setUsername} />
                            <Input hideClear label="Password" type="password" value={password} onChange={setPassword} />
                            <PasswordHelperText password={password} />
                        </Box>
                    </Container>
                </Box>
            </Modal>
            <Toast
                visible={error?.length > 0}
                onDismiss={() => setError("")}
                status="error"
                position="top"
            >
                {error}
            </Toast>
        </>
    )
}