import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Layout from '../components/Layout';
import { useAuth } from '@/components/AuthProvider';

const Contacto = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login'); // Redirigir a la página de login si no está autenticado
    }
}, [isAuthenticated, router]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`¿Cuánto es ${num1} + ${num2}?`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaValue !== captchaAnswer) {
      setSnackbar({ open: true, message: 'CAPTCHA incorrecto', severity: 'error' });
      generateCaptcha();
      return;
    }
    if (!gdprAccepted) {
      setSnackbar({ open: true, message: 'Por favor, acepta los términos de GDPR', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: 'Mensaje enviado con éxito', severity: 'success' });
        setName('');
        setEmail('');
        setMessage('');
        setCaptchaValue('');
        setGdprAccepted(false);
        generateCaptcha();
      } else {
        setSnackbar({ open: true, message: `Error: ${data.error}`, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al enviar el mensaje', severity: 'error' });
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box my={4}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: 'background.paper' }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <ContactMailIcon />
                  </Avatar>
                  <Typography variant="h4" component="h1" gutterBottom align="center">
                    Contáctanos
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                    ¿Tienes alguna pregunta o quieres hablar con nosotros? ¡Nos encantaría escucharte!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Mensaje"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <Box my={2}>
                    <Typography variant="body2">{captchaQuestion}</Typography>
                    <TextField
                      label="CAPTCHA"
                      value={captchaValue}
                      onChange={(e) => setCaptchaValue(e.target.value)}
                      margin="normal"
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={gdprAccepted}
                        onChange={(e) => setGdprAccepted(e.target.checked)}
                        name="gdprAccepted"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Acepto recibir respuesta de la consulta formulada. No se usarán los datos para otro fin (GDPR).
                      </Typography>
                    }
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    endIcon={<SendIcon />}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Enviar mensaje
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Contacto;