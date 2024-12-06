import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, onRestart }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Header onRestart={onRestart} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
