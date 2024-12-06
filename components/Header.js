import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Cambiado de CaseStudyIcon a AssignmentIcon

const Header = () => {
  const router = useRouter();

  const handleReset = () => {
    console.log('Botón de reinicio clickeado');
    
    // Limpia el localStorage
    localStorage.clear();
    console.log('localStorage limpiado');

    // Redirige a la página de inicio
    router.push('/').then(() => {
      console.log('Redirigido a la página de inicio');
      // Recarga la página después de la redirección
      window.location.reload();
    }).catch(error => {
      console.error('Error al redirigir:', error);
    });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo">
          <SportsMmaIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          SST - Simulador de Sparring Técnico
        </Typography>
        <Box>
          <Link href="/" passHref legacyBehavior>
            <Button color="inherit" component="a" startIcon={<HomeIcon />}>
              Inicio
            </Button>
          </Link>
          <Link href="/proyecto" passHref legacyBehavior>
            <Button color="inherit" component="a" startIcon={<InfoIcon />}>
              Proyecto
            </Button>
          </Link>
          <Link href="/empresas" passHref legacyBehavior>
            <Button color="inherit" component="a" startIcon={<BusinessIcon />}>
              Empresas
            </Button>
          </Link>
          <Link href="/casos-de-uso" passHref legacyBehavior>
            <Button color="inherit" component="a" startIcon={<AssignmentIcon />}>
              Casos de Uso
            </Button>
          </Link>
          <Link href="/contacto" passHref legacyBehavior>
            <Button color="inherit" component="a" startIcon={<ContactMailIcon />}>
              Contacto
            </Button>
          </Link>
          <IconButton 
            color="inherit" 
            onClick={handleReset} 
            aria-label="reiniciar"
            sx={{ ml: 1 }}
          >
            <RestartAltIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
