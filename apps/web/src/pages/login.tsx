import { Card, Button, Paper, Snackbar, Alert, Typography, TextField, Box } from "@mui/material";
import { useCallback, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketContext";
import { Registration } from "../ui/registration";
import { login, URL } from "../utils/apiCalls";
import { isValid } from "../utils/passwordValidation";
import { PasswordHelperText } from "../ui/password-helper";


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
        <Paper elevation={0}
            sx={{
                height: "98vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card raised sx={{ display: "flex", flexDirection: "column", p: 4, width: "100%", maxWidth: 400 }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ textAlign: "left" }}>
                        Login
                    </Typography>
                    <Button sx={{ ml: "auto" }} variant="text" onClick={toggleModal}>
                        <Typography variant="caption">
                            Register
                        </Typography>
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Username" required value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        onKeyDown={(event) => {
                            if (!username.length || !isValid(password)) return;
                            if (event.key === "Enter") {
                                handleLogin();
                            }
                        }}
                    />
                    <TextField
                        label="Password" required type="password"
                        value={password} onChange={({ target }) => setPassword(target.value)}
                        helperText={
                            <PasswordHelperText password={password}  />
                        }
                        onKeyDown={(event) => {
                            if (!username.length || !isValid(password)) return;
                            if (event.key === "Enter") {
                                handleLogin();
                            }
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    disabled={!username.length || !isValid(password)}
                    onClick={handleLogin}
                >
                    Submit
                </Button>
            </Card>
            <Registration isOpen={registrationIsOpen} onClose={toggleModal} onRegister={handleJoin} />
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={error.length > 0}
                onClose={() => setError("")}
                key={error}
                autoHideDuration={3000}
            >
                <Alert onClose={() => setError("")}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
    )
}