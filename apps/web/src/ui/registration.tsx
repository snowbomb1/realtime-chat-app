import { useCallback, useMemo, useState } from "react";
import { Box, Button, Typography, IconButton, Dialog, TextField, Snackbar, Alert } from "@mui/material";
import { isValid } from "../utils/passwordValidation";
import { Close } from "@mui/icons-material";
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
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <Box id="container"
                sx={{
                    display: "flex", flexDirection: "column",
                    border: "1px solid", borderColor: "divider",
                    p: 2, width: "70vw"
                }
            }>
                <Box id="header"
                    sx={{ 
                        width: "100%" , p: 1, display: "flex",
                        flexDirection: "row", alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                        <Typography sx={{ textAlign: "left" }} component="h2" variant="h6">
                            User Registration
                        </Typography>
                        <IconButton sx={{ marginLeft: "auto" }} onClick={onClose}>
                            <Close />
                        </IconButton>
                </Box>
                <Box id="body" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField label="Username" required value={username} onChange={({ target }) => setUsername(target.value)} />
                    <TextField
                        label="Password" required type="password"
                        value={password} onChange={({ target }) => setPassword(target.value)}
                        helperText={
                            <PasswordHelperText password={password}  />
                        }
                    />
                </Box>
                <Box id="footer" sx={{ float: "right", mt: 5 }}>
                    <Button disabled={isDisabled} onClick={handleRegistration} >Register</Button>
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={error?.length > 0}
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
        </Dialog>
    )
}