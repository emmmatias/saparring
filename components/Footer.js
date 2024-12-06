import React, { useState } from 'react';
import { Box, Container, Typography, Link as MuiLink, Stack, Modal, IconButton } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';

const Footer = () => {
  const [openChangelog, setOpenChangelog] = useState(false);

  const handleOpenChangelog = () => setOpenChangelog(true);
  const handleCloseChangelog = () => setOpenChangelog(false);

  const changelogContent = `

    - 🚀 Implementación inicial del sistema de entrevistas técnicas.
    - 🔧 Soporte para 11 campos tecnológicos principales en empresas de desarrollo e IT.
    - 🏷️ Funcionalidad de etiquetado para tecnologías específicas dentro de cada campo.
    - 📊 Desarrollo del analizador de ofertas de trabajo para extraer requisitos técnicos.
    - 🤖 Integración de IA para generación de preguntas adaptadas al nivel y stack tecnológico.
    - 📝 Creación del sistema de feedback con opción de descarga en PDF.
    - 🖥️ Interfaz de usuario básica para interacción con el simulador.
  `;

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 2 }}>
      <Container maxWidth="lg">
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center" 
          alignItems="center"
          flexWrap="wrap"
        >
          <Link href="/" passHref legacyBehavior>
            <MuiLink color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 0.5 }} /> Inicio
            </MuiLink>
          </Link>
          <Link href="/proyecto" passHref legacyBehavior>
            <MuiLink color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 0.5 }} /> Proyecto
            </MuiLink>
          </Link>
          <Link href="/empresas" passHref legacyBehavior>
            <MuiLink color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 0.5 }} /> Empresas
            </MuiLink>
          </Link>
          <Link href="/contacto" passHref legacyBehavior>
            <MuiLink color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
              <ContactMailIcon sx={{ mr: 0.5 }} /> Contacto
            </MuiLink>
          </Link>
          <MuiLink 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleOpenChangelog}
          >
            <HistoryIcon sx={{ mr: 0.5 }} /> Changelog
          </MuiLink>
        </Stack>
        <Typography variant="body2" color="inherit" align="center" sx={{ mt: 2 }}>
          SST - Simulador de Sparring Técnico para entrevistas - With love in 2024 Wuilders <FavoriteIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', ml: 0.5 }} />
        </Typography>
      </Container>

      <Modal
        open={openChangelog}
        onClose={handleCloseChangelog}
        aria-labelledby="changelog-modal-title"
        aria-describedby="changelog-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseChangelog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="changelog-modal-title" variant="h6" component="h2" gutterBottom>
            Changelog
          </Typography>
          <Typography 
            variant="subtitle1" 
            component="h3" 
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem', 
              mb: 2 
            }}
          >
            v0.1.0:({new Date().toLocaleDateString()})
          </Typography>
          <Typography 
            id="changelog-modal-description" 
            sx={{ 
              mt: 2, 
              whiteSpace: 'pre-wrap',
              '& > p': { marginBottom: '0.5em' }  // Añade espacio entre párrafos
            }} 
            component="div"
          >
            {changelogContent.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Footer;