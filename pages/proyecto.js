import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Layout from '../components/Layout';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ScienceIcon from '@mui/icons-material/Science';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GavelIcon from '@mui/icons-material/Gavel';
import DemoRequestForm from '../components/DemoRequestForm';

const Proyecto = () => {
  const [openAccessForm, setOpenAccessForm] = useState(false);
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login'); // Redirigir a la página de login si no está autenticado
    }
}, [isAuthenticated, router]);


  const handleOpenAccessForm = () => {
    setOpenAccessForm(true);
  };

  const handleCloseAccessForm = () => {
    setOpenAccessForm(false);
  };

  const areasCovertura = [
    { 
      icon: <ComputerIcon />, 
      area: 'Tecnología', 
      ejemplos: 'Desarrollo de Software, DevOps, Ciberseguridad, Inteligencia Artificial, Análisis de Datos, Redes, Soporte Técnico' 
    },
    { 
      icon: <BusinessCenterIcon />, 
      area: 'Negocios', 
      ejemplos: 'Administración, Marketing, Recursos Humanos, Ventas, Gestión de Proyectos, Consultoría, Emprendimiento' 
    },
    { 
      icon: <EngineeringIcon />, 
      area: 'Ingeniería', 
      ejemplos: 'Civil, Mecánica, Eléctrica, Química, Aeroespacial, Industrial, Ambiental' 
    },
    { 
      icon: <LocalHospitalIcon />, 
      area: 'Salud', 
      ejemplos: 'Medicina, Enfermería, Farmacia, Psicología, Nutrición, Fisioterapia, Administración Hospitalaria' 
    },
    { 
      icon: <GavelIcon />, 
      area: 'Legal', 
      ejemplos: 'Derecho Corporativo, Penal, Civil, Laboral, Propiedad Intelectual, Ambiental, Fiscal' 
    },
    { 
      icon: <DesignServicesIcon />, 
      area: 'Diseño y Creatividad', 
      ejemplos: 'Diseño Gráfico, UX/UI, Arquitectura, Diseño Industrial, Moda, Publicidad, Animación' 
    },
    { 
      icon: <ScienceIcon />, 
      area: 'Ciencias', 
      ejemplos: 'Física, Química, Biología, Matemáticas, Astronomía, Geología, Ciencias Ambientales' 
    }
  ];

  const beneficios = [
    { icon: <AttachMoneyIcon />, beneficio: 'Ahorro en costes', descripcion: 'Reducción de costos en el proceso de selección' },
    { icon: <SettingsIcon />, beneficio: 'Funcionalidad', descripcion: 'Amplia gama de tipos de pruebas y evaluaciones' },
    { icon: <EmojiObjectsIcon />, beneficio: 'Parametrización', descripcion: 'Adaptable a las necesidades específicas de cada empresa' },
    { icon: <AccessTimeIcon />, beneficio: 'Mejora de tiempos', descripcion: 'Proceso de evaluación más rápido y eficiente' },
    { icon: <AssessmentIcon />, beneficio: 'Informes detallados', descripcion: 'Análisis completo del desempeño de los candidatos' },
    { icon: <AutorenewIcon />, beneficio: 'Adaptabilidad', descripcion: 'Aplicable a diversos sectores y niveles profesionales' }
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <SportsKabaddiIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Simulador de Sparring Técnico (TSS)
          </Typography>

          <Paper elevation={3} sx={{ p: 3, my: 4 }}>
            <Typography variant="h5" gutterBottom>
              <EmojiObjectsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              ¿Qué es el Simulador de Sparring Técnico?
            </Typography>
            <Typography variant="body1" paragraph>
              El Simulador de Sparring Técnico (TSS) es una plataforma innovadora diseñada para revolucionar los procesos de entrevistas y evaluaciones técnicas. Simula entornos de entrevista realistas, permitiendo a los candidatos y profesionales practicar y mejorar sus habilidades, mientras que las empresas pueden evaluar de manera eficiente y objetiva a los potenciales empleados y colaboradores.
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {beneficios.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {item.icon}
                  <Typography variant="h6" align="center" gutterBottom>
                    {item.beneficio}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {item.descripcion}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={3} sx={{ p: 3, my: 4 }}>
            <Typography variant="h5" gutterBottom>
              <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Áreas de Cobertura
            </Typography>
            <Typography variant="body1" paragraph>
              SET es altamente flexible y puede adaptarse a cualquier sector o área profesional. Las áreas y tecnologías pueden ser añadidas, modificadas o unificadas según las necesidades específicas de cada proyecto o empresa.
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ejemplo de campos</TableCell>
                    <TableCell>Posibles áreas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {areasCovertura.map((area, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {area.icon}
                          <Typography sx={{ ml: 1 }}>{area.area}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{area.ejemplos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Grid container spacing={4} sx={{ my: 4 }}>
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Tipos de Evaluaciones
                </Typography>
                <List dense>
                  {['Entrevistas de respuesta libre', 'Cuestionarios', 'Pruebas de código', 'Resolución de errores', 'Manejo de situaciones', 'Cálculos y problemas matemáticos'].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <StarIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleOpenAccessForm}
                sx={{ py: 2, px: 4 }}
              >
                Solicitar Acceso
              </Button>
            </Grid>
          </Grid>

          <DemoRequestForm open={openAccessForm} onClose={handleCloseAccessForm} title="Solicitar Acceso" />
        </Box>
      </Container>
    </Layout>
  );
};

export default Proyecto;