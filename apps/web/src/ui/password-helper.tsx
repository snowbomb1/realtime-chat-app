import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { memo } from "react";


export const PasswordHelperText = memo(({ password }: {password: string}) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password)
    const validCharCount = /^[A-Za-z\d@$!%*?&]{8,16}$/.test(password)
    return (
        <Stack>
            <Typography variant="caption">
                1 uppercase letter {hasUpper ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            </Typography>
            <Typography variant="caption">
                1 lowercase letter {hasLower ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            </Typography>
            <Typography variant="caption">
                1 number {hasNum ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            </Typography>
            <Typography variant="caption">
                1 special character (@$!%*?&) {hasSpecial ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            </Typography>
            <Typography variant="caption">
                8-16 characters long {validCharCount ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            </Typography>
        </Stack>
    )
});