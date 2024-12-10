import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  ListItemText, 
  Button, 
  TextField, 
  Box, 
  Snackbar, 
  Alert,
  Chip
} from '@mui/material';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkIcon from '@mui/icons-material/Work';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const interviewTypes = {
  'Frontend': {
    'Básicas': ['HTML', 'CSS', 'JavaScript'],
    'Frameworks': ['React', 'Angular', 'Vue.js', 'Svelte'],
    'Estilos': ['Sass', 'LESS', 'Tailwind CSS', 'Bootstrap'],
    'Build Tools': ['Webpack', 'Babel', 'Vite'],
    'State Management': ['Redux', 'MobX', 'Recoil'],
    'Tipado': ['TypeScript'],
    'Testing': ['Jest', 'React Testing Library', 'Cypress'],
    'Queries': ['GraphQL']
  },
  'Backend': {
    'Lenguajes': ['Node.js', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'Go'],
    'Frameworks': ['Express', 'Django', 'Ruby on Rails', 'Spring Boot', 'ASP.NET', 'Laravel', 'Flask'],
    'Bases de datos': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'Oracle'],
    'APIs': ['REST', 'GraphQL'],
    'ORM': ['Sequelize', 'Mongoose', 'Hibernate', 'Entity Framework'],
    'Autenticación': ['JWT', 'OAuth', 'Passport.js'],
    'Mensajería': ['RabbitMQ', 'Kafka', 'Redis Pub/Sub']
  },
  'Fullstack': {
    'Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js'],
    'Backend': ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL'],
    'APIs': ['REST', 'GraphQL'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD'],
    'Autenticación': ['JWT', 'OAuth'],
    'Tiempo Real': ['WebSockets', 'Socket.io'],
    'Servicios en la Nube': ['Firebase', 'AWS', 'Azure', 'GCP']
  },
  'DevOps': {
    'Contenedores': ['Docker', 'Kubernetes'],
    'CI/CD': ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Travis CI', 'CircleCI'],
    'IaC': ['Terraform', 'Ansible', 'Puppet', 'Chef'],
    'Cloud': ['AWS', 'Azure', 'GCP'],
    'Monitoreo': ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'],
    'Gestión de Configuración': ['Git', 'Ansible'],
    'Seguridad': ['Vault', 'SonarQube'],
    'Orquestación': ['Kubernetes', 'Docker Swarm', 'Nomad']
  },
  'Data Science/Big Data': {
    'Lenguajes': ['Python', 'R'],
    'Bibliotecas': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras'],
    'Big Data': ['Hadoop', 'Spark', 'Hive', 'Pig'],
    'Visualización': ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau'],
    'Bases de Datos': ['SQL', 'MongoDB', 'Cassandra', 'HBase'],
    'Procesamiento': ['Airflow', 'Luigi'],
    'Cloud': ['AWS EMR', 'Google Dataproc', 'Azure HDInsight']
  },
  'Mobile Development': {
    'iOS': ['Swift', 'Objective-C', 'SwiftUI', 'UIKit'],
    'Android': ['Kotlin', 'Java', 'Android SDK'],
    'Cross-platform': ['React Native', 'Flutter', 'Xamarin'],
    'Herramientas': ['Xcode', 'Android Studio'],
    'Bases de Datos Móviles': ['SQLite', 'Realm', 'Core Data'],
    'Servicios': ['Firebase', 'AppCenter']
  },
  'Cybersecurity': {
    'Redes': ['Firewalls', 'IDS/IPS', 'VPN'],
    'Análisis': ['SIEM', 'Wireshark', 'Nmap'],
    'Criptografía': ['Encryption', 'SSL/TLS'],
    'Seguridad Web': ['OWASP', 'Penetration Testing'],
    'Sistemas Operativos': ['Kali Linux', 'Security-Enhanced Linux'],
    'Autenticación': ['Multi-Factor Authentication', 'Biometrics'],
    'Cumplimiento': ['GDPR', 'HIPAA', 'PCI DSS']
  },
  'Cloud Engineering': {
    'Proveedores': ['AWS', 'Azure', 'GCP'],
    'Servicios': ['EC2', 'S3', 'Lambda', 'Azure Functions', 'Google Cloud Functions'],
    'Redes': ['VPC', 'CloudFront', 'Route 53'],
    'Bases de Datos': ['RDS', 'DynamoDB', 'Cosmos DB', 'Cloud Spanner'],
    'Contenedores': ['ECS', 'AKS', 'GKE'],
    'IaC': ['CloudFormation', 'ARM Templates', 'Terraform'],
    'Monitoreo': ['CloudWatch', 'Azure Monitor', 'Stackdriver']
  },
  'QA/Testing': {
    'Automatización': ['Selenium', 'Cypress', 'Puppeteer', 'Appium'],
    'Frameworks': ['JUnit', 'TestNG', 'Mocha', 'Jasmine', 'Jest'],
    'API Testing': ['Postman', 'REST Assured', 'SoapUI'],
    'Performance': ['JMeter', 'Gatling', 'LoadRunner'],
    'BDD': ['Cucumber', 'Behave'],
    'Gestión de Pruebas': ['TestRail', 'Zephyr', 'qTest'],
    'CI/CD': ['Jenkins', 'GitLab CI', 'GitHub Actions']
  },
  'UI/UX Design': {
    'Herramientas de Diseño': ['Figma', 'Sketch', 'Adobe XD', 'InVision'],
    'Prototipado': ['Axure', 'Balsamiq', 'Framer'],
    'Diseño Gráfico': ['Adobe Photoshop', 'Illustrator'],
    'Investigación de Usuarios': ['UserTesting', 'Hotjar', 'Optimal Workshop'],
    'Diseño de Interacción': ['Principle', 'Flinto'],
    'Sistemas de Diseño': ['Zeplin', 'Abstract', 'Storybook']
  },
  'AI/ML (Artificial Intelligence)': {
    'Lenguajes': ['Python', 'R'],
    'Frameworks': ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn'],
    'Procesamiento de Datos': ['Pandas', 'NumPy'],
    'Visualización': ['Matplotlib', 'Seaborn', 'Plotly'],
    'NLP': ['NLTK', 'SpaCy', 'Gensim'],
    'Computer Vision': ['OpenCV', 'Pillow'],
    'MLOps': ['MLflow', 'Kubeflow', 'TFX']
  }
};

function InterviewSelector({ onSelectInterview, userName }) {
  const [interviewType, setInterviewType] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [interviewLevel, setInterviewLevel] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState([]);

  useEffect(() => {
    const techList = Object.values(interviewTypes).flatMap(type => 
      Object.values(type).flat()
    );
    setAllTechnologies([...new Set(techList)]);
  }, []);

  const handleInterviewTypeChange = (event) => {
    setInterviewType(event.target.value);
    setSelectedTechnologies([]);
  };

  const handleTechnologyChange = (event) => {
    const selectedTechs = event.target.value;
    setSelectedTechnologies(selectedTechs);
    
    // Añadir nuevas tecnologías si no existen en la lista actual
    const newTechs = selectedTechs.filter(tech => !allTechnologies.includes(tech));
    if (newTechs.length > 0) {
      setAllTechnologies(prev => [...prev, ...newTechs]);
    }
  };

  const handleLevelChange = (event) => {
    setInterviewLevel(event.target.value);
  };

  const handleJobRequirementsChange = (event) => {
    setJobRequirements(event.target.value);
  };

  const getSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/suggest-sparring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobRequirements }),
      });
      const data = await response.json();
      console.log('Respuesta de la API:', data);
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.interviewType && interviewTypes[data.interviewType]) {
        setSuggestion(data);
        setInterviewType(data.interviewType);
        setSelectedTechnologies(data.technologies || []);
        setInterviewLevel(data.level || '');
        
        // Añadir nuevas tecnologías a la lista general
        const newTechs = data.technologies.filter(tech => !allTechnologies.includes(tech));
        if (newTechs.length > 0) {
          setAllTechnologies(prev => [...prev, ...newTechs]);
        }
        
        setOpenSnackbar(true);
      } else {
        throw new Error('Tipo de entrevista no válido en la sugerencia');
      }
    } catch (error) {
      console.error('Error al obtener la sugerencia:', error);
      setSuggestion(null);
      setOpenSnackbar(true);
    }
    setIsLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSelectInterview(interviewType, selectedTechnologies, interviewLevel);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const renderSuggestion = () => {
    if (!suggestion) return null;
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Sugerencia de Sparring Técnico:</Typography>
        <Typography><strong>Tipo de entrevista:</strong> {suggestion.interviewType}</Typography>
        <Typography><strong>Nivel:</strong> {suggestion.level}</Typography>
        <Typography><strong>Tecnologías:</strong></Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {suggestion.technologies.map((tech, index) => (
            <Chip key={index} label={tech} color="primary" variant="outlined" />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Configurar Sparring Técnico para {userName}
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tipo de Entrevista</InputLabel>
          <Select
            value={interviewType}
            onChange={handleInterviewTypeChange}
            required
          >
            {Object.keys(interviewTypes).map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tecnologías</InputLabel>
          <Select
            multiple
            value={selectedTechnologies}
            onChange={handleTechnologyChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            required
          >
            {allTechnologies.map((tech) => (
              <MenuItem key={tech} value={tech}>
                <Checkbox checked={selectedTechnologies.indexOf(tech) > -1} />
                <ListItemText primary={tech} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Nivel</InputLabel>
          <Select
            value={interviewLevel}
            onChange={handleLevelChange}
            required
          >
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Intermedio">Intermedio</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <LightbulbIcon sx={{ mr: 1, mt: 2, color: 'warning.main' }} />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Requisitos de la oferta de trabajo (opcional)"
            placeholder="Si quieres, pega el contenido de la oferta de trabajo para guiarte en la selección del sparring técnico a realizar"
            value={jobRequirements}
            onChange={handleJobRequirementsChange}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={getSuggestion}
            disabled={isLoading || !jobRequirements}
            startIcon={<WorkIcon />}
          >
            Sugerir Sparring
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!interviewType || selectedTechnologies.length === 0 || !interviewLevel}
            endIcon={<SportsKabaddiIcon />}
          >
            Comenzar Sparring Técnico
          </Button>
        </Box>
      </form>
      {renderSuggestion()}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={suggestion ? "success" : "error"} sx={{ width: '100%' }}>
          {suggestion 
            ? "Sugerencia de sparring técnico recibida. Revisa los detalles abajo."
            : "Error al obtener la sugerencia. Por favor, inténtalo de nuevo."}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default InterviewSelector;