import { Input, Stack, Card, Button, Paper, Snackbar, Alert } from "@mui/material";
import { useCallback, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/ChatContext";


export default function LoginPage() {
    const { username, setUsername, socketRef } = useSocket();
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = useCallback(async () => {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            setError("Login failure, please try again");
            return;
        }
        const data = await response.json();
        if (data.users.length > 0 && data.users.includes(username)) {
            setError("Username already taken")
            return;
        }
        socketRef.current = io('http://localhost:3000');
        socketRef.current.on('connect', () => {
            socketRef.current?.emit('user:join', { userName: username });
            navigate("/chat");
        });
    }, [username, navigate]);

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
            <Card raised sx={{ p: 4, width: "100%", maxWidth: 400 }}>
                <h2>Login</h2>
                <Stack spacing={5}>
                    <Input type="text" value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        placeholder="Enter username"
                        required
                        onKeyDown={(event) => {
                            if (!username.length) return;
                            if (event.key === "Enter") {
                                handleLogin();
                            }
                        }}
                    />
                    <Button
                        sx={{ float: "right" }}
                        disabled={!username.length}
                        onClick={handleLogin}
                    >
                        Submit
                    </Button>
                </Stack>
            </Card>
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