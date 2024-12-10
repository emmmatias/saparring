import { useState, useEffect, createContext } from "react"
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Avatar
  } from '@mui/material';


const Dash_admin = () => {
    return(
        <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 8 }}>
            <h1>Área de adminitradores</h1>
        </Paper>
    )
}

export default Dash_admin