import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { memo } from "react";


export const PasswordHelperText = memo(({ password }: {password: string}) => {
    const requirements = [
        { label: '1 uppercase letter', valid: /[A-Z]/.test(password) },
        { label: '1 lowercase letter', valid: /[a-z]/.test(password) },
        { label: '1 number', valid: /\d/.test(password) },
        { label: '1 special character (@$!%*?&)', valid: /[@$!%*?&]/.test(password) },
        { label: '8-16 characters long', valid: /^[A-Za-z\d@$!%*?&]{8,16}$/.test(password) },
    ];

    const unmet = requirements.filter(r => !r.valid);
    if (!unmet.length) return null;
    return (
        <Stack>
            {requirements.map(({ label, valid }) => (
                <Typography key={label} variant="caption">
                    {label} {!valid 
                        ? <ErrorOutline color="error" sx={{ fontSize: 12, verticalAlign: 'middle', ml: 0.5 }} />
                        : <CheckCircleOutline color="success" sx={{ fontSize: 12, verticalAlign: 'middle', ml: 0.5 }} />
                    }
                </Typography>
            ))}
        </Stack>
    );
});