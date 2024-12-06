import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box,
  Snackbar,
  Alert
} from '@mui/material';

const DemoRequestForm = ({ open, onClose, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          subject: `Solicitud de demo: ${title}`,
          contactMethod: 'email' // Forzamos el método de contacto a email
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Solicitud enviada con éxito', severity: 'success' });
        setFormData({ name: '', email: '', company: '', message: '' });
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al enviar la solicitud', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Empresa"
              name="company"
              value={formData.company}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mensaje"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Enviar Solicitud
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DemoRequestForm;