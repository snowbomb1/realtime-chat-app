import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

interface HeaderProps {
    logOut: () => void;
}

export const Header = ({ logOut }: HeaderProps) => {

    return (
        <Box sx={{ display: "flex",
            flexDirection: "row", p: 2, 
            borderBottom: '1px solid',
            borderBottomColor: 'divider', 
            alignItems: 'center',
            gap: 4
        }}>
            <h2>Chat Window</h2>
            <Button sx={{ marginLeft: "auto" }} onClick={logOut}>Logout</Button>
        </Box>
    )
}