import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Paper, Grid, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Layout from '../components/Layout';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DemoRequestForm from '../components/DemoRequestForm';
import { useAuth } from '@/components/AuthProvider';

const EmpresasPage = () => {
  const [openDemoForm, setOpenDemoForm] = useState(false);
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const handleOpenDemoForm = () => {
    setOpenDemoForm(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login'); // Redirigir a la página de login si no está autenticado
    }
}, [isAuthenticated, router]);

  const handleCloseDemoForm = () => {
    setOpenDemoForm(false);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Sparring Técnico para Empresas
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Revoluciona tu proceso de contratación y formación con entrevistas técnicas personalizadas
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Optimiza tu Proceso de Contratación
                </Typography>
                <Typography variant="body1" paragraph>
                  Nuestro Sparring Técnico te permite evaluar a los candidatos de manera eficiente y objetiva, ahorrando tiempo y recursos en el proceso de selección.
                </Typography>
                <List>
                  {['Entrevistas realistas', 'Evaluación objetiva', 'Ahorro de tiempo', 'Mejores contrataciones'].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <SportsMmaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Potencia el Desarrollo de tu Equipo
                </Typography>
                <Typography variant="body1" paragraph>
                  Utiliza Sparring Técnico como herramienta de formación para mejorar las habilidades técnicas de tu equipo actual y mantenerlos actualizados con las últimas tecnologías.
                </Typography>
                <List>
                  {['Formación continua', 'Actualización tecnológica', 'Identificación de áreas de mejora', 'Crecimiento profesional'].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <SportsMmaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom align="center">
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personalización Total
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Nuestro Sparring Técnico se adapta completamente a tus necesidades específicas.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>Tipo de Entrevista</Typography>
                  <Typography variant="body2">Técnica, comportamental, mixta</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>Nivel Profesional</Typography>
                  <Typography variant="body2">Junior, intermedio, senior, liderazgo</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>Tecnologías</Typography>
                  <Typography variant="body2">Específicas para tu stack tecnológico</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>Skills</Typography>
                  <Typography variant="body2">Liderazgo, trabajo en equipo, comunicación</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              ¿Listo para revolucionar tu proceso de contratación y formación?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ mt: 2 }}
              onClick={handleOpenDemoForm}
            >
              Solicita una Demo
            </Button>
          </Box>

          <DemoRequestForm open={openDemoForm} onClose={handleCloseDemoForm} />
        </Box>
      </Container>
    </Layout>
  );
};

export default EmpresasPage;