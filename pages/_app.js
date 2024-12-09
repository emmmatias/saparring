import React from 'react';
import { useRouter } from 'next/router'
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../components/footer.css'
import '../styles/dash.css'
import FooterElement from '@/components/FooterElement';
import Head from 'next/head'
import Login from '.';
import '../styles/altas.css'

const theme = createTheme();

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <AuthProvider>
            <ThemeProvider theme={theme}>
                <Head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <Component {...pageProps} />
                {router.pathname != '/CommingSoon' ? <FooterElement /> : null}
                <CssBaseline />
            </ThemeProvider>
    </AuthProvider>
  )
}

export default MyApp;
