import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Avatar
} from '@mui/material';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function NameInput({ onNameSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
          <SportsMmaIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5" align="center">
          ¡Simulador de Sparring Técnico!
        </Typography>
      </Box>
      <Typography variant="body1" align="center" gutterBottom>
        <EmojiEmotionsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        ¿Cómo te gustaría que te llamáramos durante la simulación?
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Tu nombre o apodo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={!name.trim()}
        >
          Comenzar
        </Button>
      </Box>
    </Paper>
  );
}

export default NameInput;
