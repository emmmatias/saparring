import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import Layout from '../components/Layout';
import CodeIcon from '@mui/icons-material/Code';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DemoRequestForm from '../components/DemoRequestForm';

const CaseStudy = ({ icon, title, benefits }) => {
  const [openAccessForm, setOpenAccessForm] = useState(false);

  const handleOpenAccessForm = () => {
    setOpenAccessForm(true);
  };

  const handleCloseAccessForm = () => {
    setOpenAccessForm(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h5" component="h2" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <List dense>
        {benefits.map((benefit, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={benefit} />
          </ListItem>
        ))}
      </List>
      <Button 
        variant="outlined" 
        color="primary" 
        sx={{ mt: 'auto', alignSelf: 'flex-start' }} 
        onClick={handleOpenAccessForm}
      >
        Saber más
      </Button>
      <DemoRequestForm 
        open={openAccessForm} 
        onClose={handleCloseAccessForm}
        title={`Solicitar acceso para ${title}`}
      />
    </Paper>
  );
};

const CasosDeUso = () => {
  const cases = [
    {
      icon: <CodeIcon fontSize="large" color="primary" />,
      title: "Tecnología",
      benefits: [
        "Reduce el tiempo de contratación en un 40%",
        "Aumenta la precisión en la selección de candidatos en un 60%",
        "Simula entornos de desarrollo reales para evaluar habilidades prácticas",
        "Identifica a los mejores talentos en programación y desarrollo de software"
      ]
    },
    {
      icon: <EngineeringIcon fontSize="large" color="primary" />,
      title: "Ingeniería",
      benefits: [
        "Evalúa habilidades técnicas específicas de cada rama de ingeniería",
        "Reduce costos de contratación en un 35%",
        "Mejora la retención de empleados en un 25%",
        "Identifica candidatos con habilidades de innovación y resolución de problemas"
      ]
    },
    {
      icon: <LocalHospitalIcon fontSize="large" color="primary" />,
      title: "Salud",
      benefits: [
        "Evalúa competencias clínicas y habilidades de comunicación",
        "Reduce errores médicos en un 30% al contratar personal más calificado",
        "Mejora la satisfacción del paciente en un 40%",
        "Identifica profesionales de la salud con excelentes habilidades de toma de decisiones"
      ]
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: "Enseñanza",
      benefits: [
        "Evalúa habilidades pedagógicas y manejo del aula",
        "Aumenta el rendimiento estudiantil en un 25%",
        "Mejora la satisfacción de los estudiantes en un 35%",
        "Identifica educadores innovadores y adaptables"
      ]
    }
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Casos de Uso
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Descubre cómo SST puede revolucionar tu proceso de selección y mejorar drásticamente la calidad de tus contrataciones
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {cases.map((caseStudy, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <CaseStudy {...caseStudy} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default CasosDeUso;