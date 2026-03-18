import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { Box } from "@snowbomb1/nova-ui";
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
        <Box position="left">
            <div>
                {requirements.map(({ label, valid }) => (
                    <Box direction="horizontal" position='left'>
                        <small style={{ fontSize: 10,  }} key={label}>
                            {label}
                        </small>
                        {!valid 
                        ? <XCircleIcon color='red' width={20} />
                        : <CheckCircleIcon color="green" width={20} />
                        }
                    </Box>
                ))}
            </div>
        </Box>
    );
});