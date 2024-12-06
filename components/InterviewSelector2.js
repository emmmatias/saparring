import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox,
  Grid, 
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
import { useAuth } from '../components/AuthProvider';
import Loader from '@/components/Loader';
import { config } from 'dotenv';

const url_base = process.env.BASE_URL;
 
const roles = {
  'Dirección y Liderazgo': {
    'CTO': ['Visión Estratégica', 'Liderazgo', 'Gestión de Equipos'],
    'VP de Ingeniería o Tecnología': ['Gestión de Proyectos', 'Desarrollo de Estrategia Técnica'],
    'Director de IT o Tecnología': ['Gestión de Recursos', 'Planificación de IT'],
    'Gerente de Desarrollo de Software': ['Scrum', 'Agile', 'Gestión de Proyectos'],
    'Gerente de Infraestructura IT': ['Cloud Computing', 'Gestión de Infraestructura'],
    'Gerente de Seguridad Informática (CISO)': ['Gestión de Riesgos', 'Políticas de Seguridad'],
    'Arquitecto de Soluciones': ['Diseño de Sistemas', 'Integración de Sistemas'],
    'Arquitecto de Software': ['Patrones de Diseño', 'Arquitectura de Microservicios']
  },
  'Desarrollo de Software': {
    'Desarrollador Junior': ['HTML', 'CSS', 'JavaScript'],
    'Desarrollador Semi-Senior': ['JavaScript', 'Node.js', 'React'],
    'Desarrollador Senior': ['Java', 'Python', 'Arquitectura de Software'],
    'Ingeniero de Software': ['C++', 'C#', 'SQL'],
    'Ingeniero de Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js','Next.js'],
    'Ingeniero de Backend': ['Node.js', 'Python', 'Java', 'Express', 'Django'],
    'Ingeniero Full Stack': ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
    'Líder Técnico (Tech Lead)': ['Mentoría', 'Revisión de Código', 'Gestión de Proyectos'],
    'Arquitecto de Software': ['Patrones de Diseño', 'Microservicios']
  },
  'Gestión de Producto y Proyectos': {
    'Product Owner': ['Scrum', 'Gestión de Stakeholders'],
    'Product Manager': ['Análisis de Mercado', 'Planificación de Productos'],
    'Project Manager IT': ['Gestión de Proyectos', 'Metodologías Ágiles'],
    'Scrum Master': ['Facilitación', 'Gestión de Equipos', 'Scrum']
  },
  'Infraestructura y Operaciones IT': {
    'Ingeniero de DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    'Administrador de Sistemas': ['Linux', 'Windows Server', 'Automatización'],
    'Administrador de Redes': ['Cisco', 'Juniper', 'Seguridad de Redes'],
    'Ingeniero de Nube': ['AWS', 'Azure', 'GCP', 'Terraform'],
    'Ingeniero de Soporte Técnico': ['Resolución de Problemas', 'Atención al Cliente'],
    'Especialista en Soporte IT': ['Diagnóstico de Problemas', 'Soporte Remoto'],
    'Administrador de Base de Datos (DBA)': ['MySQL', 'PostgreSQL', 'MongoDB', 'Optimización de Consultas'],
    'Ingeniero de Seguridad en la Nube': ['AWS', 'Azure', 'GCP', 'Seguridad de Datos']
  },
  'Calidad y Pruebas': {
    'Ingeniero de QA': ['Selenium', 'Cypress', 'Pruebas Manuales'],
    'Ingeniero de Automatización de Pruebas': ['Jest', 'Mocha', 'Pruebas de Integración'],
    'Analista de Pruebas': ['Pruebas Funcionales', 'Documentación de Pruebas'],
    'Tester de Software': ['Pruebas de Usabilidad', 'Pruebas de Rendimiento']
  },
  'Datos y Ciencia de Datos': {
    'Analista de Datos': ['SQL', 'Excel', 'Tableau'],
    'Ingeniero de Datos': ['Hadoop', 'Spark', 'ETL'],
    'Científico de Datos': ['Python', 'R', 'TensorFlow', 'Visualización de Datos'],
    'Ingeniero de Machine Learning': ['Scikit-learn', 'PyTorch', 'Modelado Predictivo'],
    'Especialista en Inteligencia Artificial': ['TensorFlow', 'Keras', 'Procesamiento de Lenguaje Natural']
  },
  'Seguridad de la Información': {
    'CISO': ['Gestión de Riesgos', 'Cumplimiento Normativo'],
    'Analista de Seguridad': ['SIEM', 'Wireshark', 'Análisis de Vulnerabilidades'],
    'Ingeniero de Seguridad': ['Firewall', 'VPN', 'Seguridad de Aplicaciones'],
    'Especialista en Ciberseguridad': ['Penetration Testing', 'OWASP', 'Respuesta a Incidentes'],
    'Auditor de Seguridad IT': ['GDPR', 'ISO 27001', 'Análisis de Riesgos']
  },
  'Otro': {
  }
}
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

const opciones = [
  'Pruebas Tipo Test',
  'Preguntas a Desarrollar',
  'Evaluación de Complejidad Algorítmica',
  'Desarrollo de Código',
  'Corrección de Errores',
  'Completar Código'
]

function InterviewSelector(props) {
  const [interviewrole, setInterviewrole] = useState('')
  const [interviewrolesel, setInterviewrolesel] = useState('')
  const [linkedCv, setLinkedCV] = useState()
  const [tecnologia_candidato, setTecnologiaCandidato] = useState()
  const [interviewType, setInterviewType] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [interviewLevel, setInterviewLevel] = useState('');
  const [interviewdificultyLevel, setinterviewdificultyLevel] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [url_anuncio, set_url_anuncio] = useState(''); 
  const [emailCandidato, setEmailCandidato] = useState('')
  const [time, setTime] = useState(30)
  const [message, setMessage] = useState('')
  const [candidato, setCandidato] = useState('')
  const [empresa, setEmpresa] = useState(props.empresa)
  const [agregar, setAgregar] = useState('')
  const [step, setStep] = useState(1)
  const [visible, setvisible] = useState(false)
  const [candidatoApellido,setCandidatoApellido] = useState()
  const [horas, setHoras] = useState(0)
  const [comentarios, setComentarios] = useState('')
  const [minutos, setMinutos] = useState(30)
  const [otra, setOtra] = useState('')
  const [datamessage, setdatamessage] = useState('')
  const [recluiter, setRecluiter] = useState('')
  const [nueva_pregunta, setNueva_pregunta] = useState()
  const [Preguntas, setPreguntas] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [numeropreguntatexto ,setnumeropreguntatexto] = useState(0)
  const [valores, setValores] = useState({})
  const [result, setResult] = useState(false)
  const { isAuthenticated, login, logout, user, userType } = useAuth()
  console.log(step)

  const handleAddCategory = () => {
    if (otra.trim() !== '') { // Asegúrate de que no se agregue un valor vacío
        setCategorias(prev => [...prev, otra]);
        setOtra(''); // Limpiar el campo de entrada
    }
};

const handleAddCategory2 = (e, val) => {
  e.preventDefault()
  if (interviewType.trim() !== '') { // Asegúrate de que no se agregue un valor vacío
      setCategorias(prev => [...prev, interviewType]);
  }
};


  useEffect(() => {
    console.log('el user actual:', user)
    console.log(props.recluiter)
    const techList = Object.values(interviewTypes).flatMap(type => 
      Object.values(type).flat()
    )
    setAllTechnologies([...new Set(techList)])
    setRecluiter(props.recluiter)
  }, [])

  useEffect(() => {
    console.log('El spet actual es: ', step)
    console.log('el user actual es: ', user)
  }, [step])
  
  const handleInterviewroleChange = (event) => {
    setInterviewrole(event.target.value);
  };

  useEffect(() => {
    console.log(categorias)
  },[categorias])

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

  const handleTechnologyAgregar = (valor) => {
    const selectedTechs = [valor]
    //setSelectedTechnologies(prev => {[...prev, valor]});
    // Añadir nuevas tecnologías si no existen en la lista actual
    const newTechs = selectedTechs.filter(tech => !allTechnologies.includes(tech));
    if (newTechs.length > 0) {
      setSelectedTechnologies(prev => [...prev, ...newTechs]);
    }
    setAgregar('')
  };

  const handleLevelChange = (event) => {
    setInterviewLevel(event.target.value);
  };

  const handleJobRequirementsChange = (event) => {
    set_url_anuncio('')
    setJobRequirements(event.target.value)

  };

  const getSuggestion = async () => {
    setIsLoading(true);
    if(url_anuncio.length > 0){
      let response = await fetch(`/api/webscrapper?url=${url_anuncio}`, {
        method:'GET'
      })
      if(response.ok){
        const data = await response.json()
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
      }
      if(!response.ok){
        setSuggestion(null);
        setOpenSnackbar(true);
      }
    }else if(jobRequirements.length > 0){
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
    }

  }

  useEffect(() => {
    console.log(url_anuncio)
  },[url_anuncio])

  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = await fetch('/api/guardar_config')
    let max_time = time || 30
    if(response.ok){

    }else if(!response.ok){

    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  const handledificultyChange = (e) => {
    setinterviewdificultyLevel(e.target.value)
  }

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


useEffect(() => {
  console.log("Preguntas actualizadas:", Preguntas);
}, [Preguntas]); // Este efecto se ejecuta cada vez que preguntas cambia


const handleCheckboxChange1 = (event) => {
  const {name} = event.target
  if (!Preguntas.some(p => p.name === name)) {
    setPreguntas(prevPreguntas => [
        ...prevPreguntas,
        { name, numero: valores[name] || 0 } // Agregar con valor por defecto
    ])
}

}

const handleCheckboxChange = (event) => {
  const { name, checked } = event.target;
  if (checked) {
      // Agregar objeto si no existe
      if (!Preguntas.some(p => p.name === name)) {
          setPreguntas(prevPreguntas => [
              ...prevPreguntas,
              { name, numero: valores[name] || 0 } // Agregar con valor por defecto
          ]);
      }
  } else {
      // Eliminar objeto si está desmarcado
      setPreguntas(prevPreguntas => prevPreguntas.filter(p => p.name !== name));
  }
  console.log(Preguntas)
};

const handleInputChange = (event) => {
  const { name, value } = event.target;
  if(value > 0){

    if (!Preguntas.some(p => p.name === name)) {
      setPreguntas(prevPreguntas => [
          ...prevPreguntas,
          { name, numero: valores[name] || 0 } // Agregar con valor por defecto
      ]);
  }
    setValores(prevValores => ({
      ...prevValores,
      [name]: value
  }))
  
  // Actualizar el array de preguntas con el nuevo valor
  setPreguntas(prevPreguntas =>
    prevPreguntas.map(p => 
        p.name === name ? { ...p, numero: value } : p
    )
  )

  }else{
    setValores(prevValores => ({
      ...prevValores,
      [name]: value
  }))
  
    setPreguntas(prevPreguntas => prevPreguntas.filter(p => p.name !== name))
  }
  
};

useEffect(() => {
  setTime(Number(Number(horas * 60) + Number(minutos)))
}, [horas, minutos])

const generar_sparring = async () => {
    let obj = {
    interviewType,
      user,
      recluiter,
      emailCandidato,
      selectedTechnologies,
      interviewLevel,
      interviewdificultyLevel,
      time,
      Preguntas
  }
  console.log('objeto a enviar', obj)
  try{
    let response = await fetch('/api/generar_sparrig', {
      method: 'POST',
      body: JSON.stringify(
        {
        interviewrole,
        user,
        recluiter,
        emailCandidato,
        empresa,
        candidato,
        interviewType,
        selectedTechnologies,
        interviewLevel,
        interviewdificultyLevel,
        time,
        Preguntas}
      )})
      if(response.ok){
        let data = await response.json()
        setResult(data)
        console.log('DATATOS DEL CANDIDATO RECIBIDOS')
        if(data.data_candidato){
          console.log('DATA DEL CANDIDTO: ', data.data_candidato, typeof(data.data_candidato))
          //asignar la data anterior del candidato
      setCandidato(data.data_candidato.nombre),
      setCandidatoApellido(data.data_candidato.apellido)
      let tecnologias_previas = JSON.parse(data.data_candidato.tecnologias).tecnologias
      setSelectedTechnologies([...tecnologias_previas])
      setEmailCandidato(data.data_candidato.mail)
      let categorias_previas = JSON.parse(data.data_candidato.config).categorias
      setCategorias([...categorias_previas])
      setLinkedCV(JSON.parse(data.data_candidato.config).linkedin)
      JSON.parse(data.data_candidato.config).comentarios ? setComentarios(JSON.parse(data.data_candidato.config).comentarios) : setComentarios('') 
        }
      }
      if(!response.ok){
        setvisible(true)
        let data = await response.json()
        data.message ? setdatamessage(data.message) : setdatamessage('Error, intente nuevamente')
      }
  }catch(error){
    setvisible(true)
    setdatamessage(`${error}, intente nuevamente`)
  }
  
}

const handledit = (event, index) => {
  const { value } = event.target;
  setResult(prev => ({
    ...prev,
    preguntas_generadas: [
      ...prev.preguntas_generadas.slice(0, index),
      { ...prev.preguntas_generadas[index], pregunta: value },
      ...prev.preguntas_generadas.slice(index + 1),
    ],
  }));
}

const handleditoption = (event, indexPregunta, indexOpcion) => {
  const { value } = event.target;
  setResult(prev => ({
    ...prev,
    preguntas_generadas: prev.preguntas_generadas.map((pregunta, idx) => {
      if (idx === indexPregunta) {
        return {
          ...pregunta,
          opciones: pregunta.opciones.map((opcion, idxOpcion) => {
            if (idxOpcion === indexOpcion) {
              return value;
            }
            return opcion;
          }),
        };
      }
      return pregunta;
    }),
  }));
}

const guardarModif = async (e) => {
  e.preventDefault()
  let respose = await fetch('/api/editar_sparring',{
    method:'POST',
    body: JSON.stringify({
      id: result.id,
      preguntas_generadas: result.preguntas_generadas
    })
  })
  if(respose.ok){
    let data = await respose.json()
    setMessage(data.message ? data.message : 'Cambios guardados')
  }else{
    setMessage('Error al guardar edicion')
  }
}

useEffect(() => {
console.log('MODIFICANDO RESULT')
console.log('result', result)
},[result])


const guardarCandidato = async () => {
  let response = await fetch('/api/registro_candidato2',
    {
      method:'POST',
      body: JSON.stringify({
        nombre: candidato,
        apellido: candidatoApellido,
        tecnologias: [...selectedTechnologies],
        emailCandidato,
        categorias,
        linkedCv,
        comentarios,
        id_prueba: result.id,
        recluter: empresa
      })
    }
  )
  if(response.ok){
    let data = await response.json()
    setvisible(true)
    data.message ? setdatamessage(data.message) : setdatamessage('Error, reintente')
  }
  if(!response.ok){
    let data = await response.json()
    setvisible(true)
    data.message ? setdatamessage(data.message) : setdatamessage('Error, reintente')
  }
}

const addOption = (e ,index) => {
  e.preventDefault()
  const updatedResult = {
    ...result,
    preguntas_generadas: result.preguntas_generadas.map((pregunta, i) => {
      if (i === index) {
        return {
          ...pregunta,
          opciones: [...pregunta.opciones, '']
        };
      }
      return pregunta;
    })
  }
  setResult(updatedResult)
}


const removeOption = (e, preguntaIndex, opcionIndex) => {
  e.preventDefault()
  const updatedResult = {
    ...result,
    preguntas_generadas: result.preguntas_generadas.map((pregunta, i) => {
      if (i === preguntaIndex) {
        return {
          ...pregunta,
          opciones: pregunta.opciones.filter((_, j) => j !== opcionIndex)
        };
      }
      return pregunta;
    })
  };
  setResult(updatedResult)
}

useEffect(() => {
console.log(result)
},[result])

const style22 = {
  popup: {
      display: 'block', /* Usar flex para centrar el contenido */
      position: 'fixed', /* Fijo en la ventana */
      zIndex: 1000, /* Por encima de otros elementos */
      left: '35%',
      top: '40%',
      textAlign: 'center',
      backgroundColor: 'white', /* Fondo semi-transparente */
      borderColor: 'black',
      alignItems: 'center',
      BorderStyle: 'solid',
      borderRadius: '10px',
      boxShadow:'2px 2px 10px 2px rgba(0, 0, 0, 0.5)',
      padding:'5%'
  }
}


const textareaRef = useRef(null);

useEffect(() => {
    if (textareaRef.current) {
        // Resetea la altura
        textareaRef.current.style.height = 'auto';
        // Ajusta la altura al contenido
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
}, [result]); // Se ejecuta cuando el valor cambia


  return (
    <div>
    <div style={{margin:'8%'}}>
      <Typography variant="h5" gutterBottom>
        Configurar Sparring Técnico
      </Typography>
      <form>
        {step == 1 && <div>
          <FormControl item sx={{width: '100%', mb: 2}}>
          <Grid container item spacing={3} alignItems="center">
          <Grid item sx={{width: '33%'}}>
        <TextField
            fullWidth
            autoFocus
            value={empresa}
            label="Empresa"
            variant="outlined"
            margin="normal"
            onChange={(e) => {setEmpresa(e.target.value)}}
            placeholder="Empresa"
            type='text'
        />
    </Grid>
    <Grid item sx={{width: '33%'}}> 
        <TextField
            fullWidth
            autoFocus
            required
            value={candidato}
            label="Candidato"
            variant="outlined"
            margin="normal"
            onChange={(e) => {setCandidato(e.target.value)}}
            placeholder="Candidato"
            type='text'
        />
    </Grid>
    <Grid item sx={{width: '33%'}}> 
        <TextField
            fullWidth
            autoFocus
            value={emailCandidato}
            label="Email Candidato"
            variant="outlined"
            required
            margin="normal"
            onChange={(e) => {setEmailCandidato(e.target.value)}}
            placeholder="Email candidato"
            type='text'
        />
    </Grid>
          </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{background: "white"}}>{interviewrolesel != 'Otro' ? 'Rol de la entrevista' : 'Rol personalizado'}</InputLabel>
          {interviewrolesel != 'Otro' ? (<Select
            value={interviewrole}
            onChange={(e) => {handleInterviewroleChange(e); setInterviewrolesel(e.target.value)}}
            required
          >
            {Object.keys(roles).map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>) : (<TextField
          fullWidth
          autoFocus
          value={interviewrole}
          variant="outlined"
          margin="normal"
          required
          onChange={(e) => setInterviewrole(setInterviewrole(e.target.value))}
          placeholder="Rol personalizado"
          type='text'
          sx={{ mb: 2 }}
          />)}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{background: "white"}}>Tipo de Entrevista</InputLabel>
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
        <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
        fullWidth
        autoFocus
        value={agregar}
        label="Agrega tecnologías específicas"
        variant="outlined"
        margin="normal"
        onChange={(e) => {setAgregar(e.target.value)}}
        placeholder="Agrega tecnologías específicas"
        type='text'
        sx={{ mb: 2 }}
        />
        </Grid>
        <Grid item >
        <Button
        variant="contained"
        disabled={!agregar}
        onClick={(e) => {handleTechnologyAgregar(agregar); setAgregar('')}}
        sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >Agregar</Button>
        </Grid>
        </Grid>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{background: "white"}}>Tecnologías</InputLabel>
          <Select
            multiple
            value={selectedTechnologies}
            onChange={handleTechnologyChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value, index) => (
                  <Chip key={index} label={value} color="primary" variant="outlined" />
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
          <InputLabel sx={{background: "white"}}>Nivel</InputLabel>
          <Select
            value={interviewLevel}
            onChange={handleLevelChange}
            required
          >
            <MenuItem value="Trainee">Trainee (Practicante)</MenuItem>
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Semi-Senior">Semi-Senior (Intermedio o Mid-Level)</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
            <MenuItem value="Lead">Lead (Líder Técnico)</MenuItem>
            <MenuItem value="Manager">Manager o Gerente</MenuItem>
            <MenuItem value="Director">Director</MenuItem>
            <MenuItem value="VP">VP (Vicepresidente) o Head of IT/CTO</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{background: "white"}}>Dificultad</InputLabel>
          <Select
            value={interviewdificultyLevel}
            onChange={(e) => {setinterviewdificultyLevel(e.target.value)}}
            required
          >
            <MenuItem value="Principiante">Principiante</MenuItem>
            <MenuItem value="Básico">Básico</MenuItem>
            <MenuItem value="Intermedio">Intermedio</MenuItem>
            <MenuItem value="Avanzado">Avanzado</MenuItem>
            <MenuItem value="Experto">Experto</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <TextField
        fullWidth
        autoFocus
        value={url_anuncio}
        label="¿Tienes alguna URl de anuncio?"
        variant="outlined"
        margin="normal"
        disabled={jobRequirements.length > 0}
        onChange={(e) => {set_url_anuncio(e.target.value); setJobRequirements('')}}
        placeholder="URl de anuncio"
        type='text'
        sx={{ mb: 2 }}
        />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <LightbulbIcon sx={{ mr: 1, mt: 2, color: 'warning.main' }} />
          <TextField
            fullWidth
            multiline
            rows={4}
            disabled={url_anuncio.length > 0}
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
            disabled={!jobRequirements && !url_anuncio}
            startIcon={<WorkIcon />}
          >
            Sugerir Sparring
          </Button>
          <Button
            onClick={(e)=>{setStep(2)}}
            variant="contained"
            color="primary"
            disabled={!interviewType || selectedTechnologies.length === 0 || !interviewLevel}
            endIcon={<SportsKabaddiIcon />}
          >
            Configración de preguntas
          </Button>
        </Box>
        </div>}
        {
            step == 2 && (
            <>
            <div class="warning-banner">
            <span class="material-icons warning-icon">warning</span>
            <div class="warning-text">
                <strong>¡Importante!</strong> La configuración determinará el tipo y cantidad de preguntas 
                que se generarán para la prueba técnica.
            </div>
            </div>

            <div class="config-card time-config">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#607d8b"}}>
                    <span class="material-icons">schedule</span>
                </div>
                <h2 class="config-title">Tiempo de la Prueba</h2>
                <span class="help-icon" onclick="mostrarAyuda('tiempo')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div className="time-selector">
                <div className="time-input-group">
                    <div className="time-input2">
                        <input value={ horas } type="number" min="0" max="24" className="form-control time-control" id="hours" onChange={e => setHoras(e.target.value)}/>
                        <label>horas</label>
                    </div>
                    <span className="time-separator">:</span>
                    <div className="time-input2">
                        <input value={minutos} type="number" min="0" max="59"  className="form-control time-control" id="minutes" onChange={(e) => setMinutos(e.target.value)}/>
                        <label>minutos</label>
                    </div>
                </div>
                <div className="time-total">
                    Tiempo total: <span id="tiempoTotal">{time}</span> minutos
                </div>
            </div>
            <div class="time-behavior">
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="timeStrict" name="timeBehavior" value="strict" checked/>
                        <label for="timeStrict">
                            <span class="radio-icon">
                                <span class="material-icons">timer_off</span>
                            </span>
                            <div class="radio-content">
                                <span class="radio-title">Finalización estricta</span>
                                <span class="radio-description">La prueba se guardará y finalizará automáticamente al cumplirse el tiempo</span>
                            </div>
                        </label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="timeFlexible" name="timeBehavior" value="flexible"/>
                        <label for="timeFlexible">
                            <span class="radio-icon">
                                <span class="material-icons">update</span>
                            </span>
                            <div class="radio-content">
                                <span class="radio-title">Tiempo flexible</span>
                                <span class="radio-description">El candidato podrá continuar después del tiempo límite (se marcará como excedido)</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            </div>
              {/* PREGUNTAS TIPO TEST */}
            <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#1976d2"}}>
                    <span class="material-icons">quiz</span>
                </div>
                <h2 class="config-title">Preguntas Tipo Test</h2>
                <span class="help-icon" onclick="mostrarAyuda('test')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label  class="config-label">Número de preguntas:</label>
                    <input name={'Pruebas Tipo Test'} type="number" class="form-control" min="0" max="20"
                           onChange={handleInputChange} value={valores['Pruebas Tipo Test'] || ''}/>
                </div>
            </div>
            </div>

            <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#2e7d32;"}}>
                    <span class="material-icons">description</span>
                </div>
                <h2 class="config-title">Preguntas de Desarrollo</h2>
                <span class="help-icon" onclick="mostrarAyuda('desarrollo')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label class="config-label">Número de preguntas:</label>
                    <input name={'Preguntas a Desarrollar'} type="number" class="form-control" min="0" max="10" 
                           onChange={handleInputChange} value={valores['Preguntas a Desarrollar'] || ''}/>
                </div>
            </div>
            </div>

        <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundcolor: "#ed6c02"}}>
                    <span class="material-icons">code</span>
                </div>
                <h2 class="config-title">Desarrollo de Código</h2>
                <span class="help-icon" onclick="mostrarAyuda('codigo')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label class="config-label">Número de preguntas:</label>
                    <input name={'Desarrollo de Código'} type="number" class="form-control" min="0" max="10"
                           onChange={handleInputChange} value={valores['Desarrollo de Código'] || ''}/>
                </div>
            </div>
        </div>

        <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#d32f2f"}}>
                    <span class="material-icons">bug_report</span>
                </div>
                <h2 class="config-title">Errores de Código</h2>
                <span class="help-icon" onclick="mostrarAyuda('errores')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label class="config-label">Número de preguntas:</label>
                    <input name={'Corrección de Errores'} type="number" class="form-control" min="0" max="10"
                           onChange={handleInputChange} value={valores['Corrección de Errores'] || ''}/>
                </div>
            </div>
        </div>

        <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#9c27b0"}}>
                    <span class="material-icons">build</span>
                </div>
                <h2 class="config-title">Completar Código</h2>
                <span class="help-icon" onclick="mostrarAyuda('completar')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label class="config-label">Número de preguntas:</label>
                    <input name={'Completar Código'} type="number" class="form-control" min="0" max="10"
                           onChange={handleInputChange} value={valores['Completar Código'] || ''}/>
                </div>
            </div>
        </div>

        <div class="config-card">
            <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#0288d1"}}>
                    <span class="material-icons">analytics</span>
                </div>
                <h2 class="config-title">Complejidad Algorítmica</h2>
                <span class="help-icon" onclick="mostrarAyuda('complejidad')">
                    <span class="material-icons">help_outline</span>
                </span>
            </div>
            <div class="config-row">
                <div class="config-control">
                    <label class="config-label">Número de preguntas:</label>
                    <input name={'Evaluación de Complejidad Algorítmica'} type="number" class="form-control" min="0" max="10" 
                           onChange={handleInputChange} value={valores['Evaluación de Complejidad Algorítmica'] || ''}/>
                </div>
            </div>
        </div>

        <div class="total-questions">
            <span class="material-icons total-icon">summarize</span>
            <span class="total-text">Total de preguntas: <strong id="totalPreguntas">{Preguntas.reduce((accumulator, current) => {
            return accumulator + Number(current.numero);
            }, 0)}</strong></span>
        </div>

        <div class="btn-container">
            <button disabled={true} class="btn btn-success" onclick="guardarConfiguracion()">
                <span class="material-icons">save</span>
                Guardar Configuración
            </button>
            <button disabled={!(Preguntas.length > 0 && Preguntas[0].numero > 0)} class="btn btn-primary" onClick={(e)=>{setStep(3); generar_sparring()}}>
                <span class="material-icons">play_arrow</span>
                Generar Prueba
            </button>
        </div>
            </>
          )
        }
        {
          step == 3 && (<>
            {result ?
            <>
            {/* El result recibe el data del sparring generado result.id result.preguntas_generadas */}
            {result.preguntas_generadas.map((el, index) => {
              if(el.tipo == 'Pruebas Tipo Test'){
                return(
                  <div key={index} class="config-card">
                    <div class="config-header">
                      <div class="config-icon" style={{backgroundColor: "#1976d2"}}>
                        <span class="material-icons">quiz</span>
                      </div>
                        <h2 class="config-title">Preguntas Tipo Test</h2>
                        <span class="material-icons help-icon" onclick="mostrarAyuda('test')">help_outline</span>
                      </div>
                    <div class="question-editor">
                    <textarea ref={textareaRef}
                     className='textarea' key={index} onChange={(event) => {handledit(event, index)}} value={el.pregunta}/>
                    {el.opciones.map((el1, index1) => {
                      return(
                        <div key={index1} class="option-row correct-option">
                          <textarea ref={textareaRef}
  onChange={(event) => {handleditoption(event, index, index1)}} class="edit-field" type='text' value={el1}/>
                          <button className="btn btn-primary" onClick={(e)=>{removeOption(e,index,index1)}} >Eliminar Opción</button>
                        </div>
                      )
                    })}
                    </div>
                    <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onClick={(e) => {addOption(e, index)}}>
                        <span class="material-icons">add</span>
                        Sumar Opción 
                    </button>
                    <button class="btn btn-primary" onClick={(e) => {guardarModif(e)}}>
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                  </div>
                )
              }
              if(el.tipo == 'Preguntas a Desarrollar'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                    <div class="config-icon" style={{backgroundColor: "#2e7d32"}}>
                        <span class="material-icons">description</span>
                    </div>
                    <h2 class="config-title">Preguntas de Desarrollo</h2>
                    <span class="material-icons help-icon" onclick="mostrarAyuda('desarrollo')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <textarea ref={textareaRef}
 className='textarea' key={index} onChange={(event) => handledit(event, index)} class="edit-field" rows="4" value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Desarrollo de Código'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#ed6c02"}}>
                    <span class="material-icons">code</span>
                </div>
                <h2 class="config-title">Desarrollo de Código</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('codigo')">help_outline</span>
                  </div>
                  <div class="question-editor">
                    <textarea ref={textareaRef}
 className='textarea' key={index} onChange={(event) => handledit(event, index)} class="edit-field" rows="4" value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Corrección de Errores'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#d32f2f"}}>
                    <span class="material-icons">bug_report</span>
                </div>
                <h2 class="config-title">Corrección de Errores</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('errores')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <textarea ref={textareaRef}
 className='textarea' class="edit-field" onChange={(event) => handledit(event, index)} key={index} value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Completar Código'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#9c27b0"}}>
                    <span class="material-icons">build</span>
                </div>
                <h2 class="config-title">Completar Código</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('completar')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <div class="code-block" style={{backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px", marginTop: "12px"}}>
                  <textarea ref={textareaRef}
 className='textarea' key={index} class="edit-field" onChange={(event) => handledit(event, index)} value={el.pregunta} rows="20" style={{fontFamily: "monospace"}} />
                  </div>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Evaluación de Complejidad Algorítmica'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#0288d1"}}>
                    <span class="material-icons">analytics</span>
                </div>
                <h2 class="config-title">Análisis de Complejidad</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('complejidad')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <div class="code-block" style={{backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px", marginTop: "12px"}}>
                  <textarea ref={textareaRef}
 key={index} class="edit-field" onChange={(event) => handledit(event, index)} rows="15" value={el.pregunta} style={{fontFamily: "monospace"}} />
                  </div>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>  )
              }
            })}
            {/* Damos de alta al candidato */}
            <div>
            </div>
            <button className="btn" style={{backgroundColor:"green"}} onClick={(e) => {setStep(6)}}>Siguiente</button>
            </> : <Loader/>
            }
            </>
          )
        }
        {
                  (step == 6) ? (
                    <div>
                      {visible && (
        <div style={style22.popup}>
          <p>{datamessage}</p>
          <button class="btn-primary" onClick={(e) => {setvisible(null); props.main()}}>cerrar</button>
        </div>
        )}
                    <div class="container">
              <div class="form-card">
                  <div class="form-header">
                      <h1 class="form-title">Datos del Candidato</h1>
                  </div>
                  <div class="section">
                      <h2 class="section-title">Datos Personales</h2>
                      <div class="form-grid">
                          <div class="form-field">
                              <label>Nombre</label>
                              <input type="text" value={candidato} class="input-field" placeholder="Nombre del candidato"/>
                          </div>
                          <div class="form-field">
                              <label>Apellidos</label>
                              <input type="text" value={candidatoApellido} onChange={(e) => {
                                setCandidatoApellido(e.target.value)
                              }} class="input-field" placeholder="Apellidos del candidato"/>
                          </div>
                          <div class="form-field">
                              <label>Email</label>
                              <input type="email" value={emailCandidato} class="input-field" placeholder="email@ejemplo.com"/>
                          </div>
                          <div class="form-field">
                              <label>LinkedIn/CV</label>
                              <input type="url" value={linkedCv} onChange={(e) => setLinkedCV(e.target.value)} class="input-field" placeholder="https://linkedin.com/in/..."/>
                          </div>
                      </div>
                  </div>
                  <div class="section">
                      <h2 class="section-title">Datos de la Prueba</h2>
                      <div class="form-grid">
                          <div class="form-field">
                              <label>ID de la Prueba</label>
                              <div class="id-group">
                                  <span class="generated-id">{result.id}</span>
                              </div>
                          </div>
                          <div class="form-field">
                              <label>Empresa</label>
                              <input type="text" class="input-field" value={empresa} onChange={(e) => setEmpresa(e.target.value)}/>
                          </div>
                          <div class="form-field">
                              <label>Nivel de Dificultad</label>
                              <select class="select-field" onChange={e=>{setinterviewdificultyLevel(e.target.value)}} value={interviewdificultyLevel}>
                                  <option value="Básico">Básico</option>
                                  <option value="Intermedio">Intermedio</option>
                                  <option value="Avanzado">Avanzado</option>
                                  <option value="Experto">Experto</option>
                                  <option value="Senior">Senior</option>
                              </select>
                          </div>
                          <div class="form-field">
                              <label>Nivel Profesional</label>
                              <select class="select-field" onChange={(e) => {setInterviewLevel(e.target.value)}} value={interviewLevel}>
                                  <option value="trainee">Trainee</option>
                                  <option value="junior">Junior Developer</option>
                                  <option value="mid">Mid-Level Developer</option>
                                  <option value="senior">Senior Developer</option>
                                  <option value="lead">Tech Lead</option>
                                  <option value="architect">Software Architect</option>
                                  <option value="engineering_manager">Engineering Manager</option>
                                  <option value="director">Technical Director</option>
                                  <option value="cto">CTO</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div class="section">
                      <h2 class="section-title">Categorías</h2>
                      <div class="input-row">
                          <select value={interviewType} class="select-field" id="categorySelect" onChange={e => {setInterviewType(e.target.value)}}>
                              <option value="Backend">Backend</option>
                              <option value="Frontend">Frontend</option>
                              <option value="Full Stack">Full Stack</option>
                              <option value="DevOps">DevOps</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Data Science">Data Science</option>
                              <option value="QA">QA</option>
                              <option value="UI/UX">UI/UX</option>
                              <option value="Otras categorías">Otras categorías</option>
                          </select>
                          {interviewType != 'Otras categorías' && <button type='button' onClick={e => handleAddCategory2(e, interviewType)}>Añadir</button>}
                          {interviewType == 'Otras categorías' && <input value={otra} onChange={e => setOtra(e.target.value)}/>}
                          {interviewType == 'Otras categorías' && <button onClick={handleAddCategory}>Añadir</button>}
                      </div>
                      <div class="tags-container" id="categoryTags">
                      </div>
                  </div>
      
                  <div class="section">
                      <h2 class="section-title">Tecnologías</h2>
                      <div class="input-row">
                          <input type="text" 
                                 id="techInput"
                                 value={tecnologia_candidato}
                                 class="input-field"
                                 onChange={e => setTecnologiaCandidato(e.target.value)} 
                                 placeholder="Añade tecnología"/>
                                 <button disabled={!tecnologia_candidato} onClick={(e) => {setSelectedTechnologies(prev => [...prev, tecnologia_candidato]); setTecnologiaCandidato('')}}>Añadir</button>
                      </div>

                      <div class="tags-container" id="techTags">
                      {selectedTechnologies.map((el,index) => {<Chip key={index} label={el} color="primary" variant="outlined" />})}
                      </div>
                  </div>
                  <div class="section">
                      <h2 class="section-title">Comentarios</h2>
                      <div class="form-field">
                          <label>Comentarios sobre el candidato</label>
                          <textarea  
                              class="textarea-field" 
                              rows="4"
                              value={comentarios}
                              onChange={(e) => setComentarios(e.target.value)}
                              placeholder="Añade cualquier comentario relevante sobre el candidato..."></textarea>
                      </div>
                  </div>
                  <div class="summary-section">
                      <h2 class="section-title">Resumen del Candidato</h2>
                      <div class="summary-block">
                          <h3 class="summary-subtitle">Datos del Candidato</h3>
                          <div class="summary-grid">
                              <div class="summary-item">
                                  <span class="summary-label">Nombre completo</span>
                                  <span class="summary-value" id="summaryName">{`${candidato}, ${candidatoApellido}`}</span>
                              </div>
                              <div class="summary-item">
                                  <span class="summary-label">Email</span>
                                  <span class="summary-value" id="summaryEmail">{emailCandidato}</span>
                              </div>
                              <div class="summary-item">
                                  <span class="summary-label">LinkedIn/CV</span>
                                  <span class="summary-value" id="summaryLinkedIn">{linkedCv}</span>
                              </div>
                          </div>
                      </div>
      
                      
                      <div class="summary-block">
                          <h3 class="summary-subtitle">Datos de la Prueba</h3>
                          <div class="summary-grid">
                              <div class="summary-item">
                                  <span class="summary-label">ID Prueba</span>
                                  <span class="summary-value" id="summaryId">{result.id}</span>
                              </div>
                              <div class="summary-item">
                                  <span class="summary-label">Empresa</span>
                                  <span class="summary-value" id="summaryCompany">{empresa}</span>
                              </div>
                              <div class="summary-item">
                                  <span class="summary-label">Nivel Profesional</span>
                                  <span class="summary-value" id="summaryLevel">{interviewLevel}</span>
                              </div>
                              <div class="summary-item">
                                  <span class="summary-label">Dificultad</span>
                                  <span class="summary-value" id="summaryDifficulty">{interviewdificultyLevel}</span>
                              </div>
                          </div>
                      </div>
      
                      
                      <div class="summary-block">
                          <h3 class="summary-subtitle">Categorías</h3>
                          <div class="summary-tags" id="summaryCategories">{categorias.join(' ')}</div>
                      </div>
      
                     
                      <div class="summary-block">
                          <h3 class="summary-subtitle">Tecnologías</h3>
                          <div class="summary-tags" id="summaryTechnologies">{selectedTechnologies.join(' ')}</div>
                      </div>
      
                  
                      <div class="summary-block">
                          <h3 class="summary-subtitle">Comentarios</h3>
                          <div class="summary-text" id="summaryComments">{comentarios}</div>
                      </div>
                  </div>
                  <div>
                      <div style={{marginTop:'1%'}}>
                      <button class="btn-primary" type="button" onClick={(e) => {guardarCandidato(); props.main}}>
                          <span class="material-icons">save</span>
                          <p>Guardar Candidato y Finalizar</p><br/><br/>
                      </button>
                      
                      </div>
                      
                  </div>
              </div>
          </div>
                    </div> 
                  ) : null
            }
      </form>
      {
        message.length > 0 && <div className="popup" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div className="popup-content" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            width: '500px',
          }}>
            {message}
            <button class="btn btn-primary" onClick={(e) => setMessage('')}>
              Aceptar
            </button>
          </div>
        </div>
      }
      {/*renderSuggestion()*/}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={suggestion ? "success" : "error"} sx={{ width: '100%' }}>
          {suggestion 
            ? "Sugerencia de sparring técnico recibida. Revisa los detalles abajo."
            : "Error al obtener la sugerencia. Por favor, inténtalo de nuevo."}
        </Alert>
      </Snackbar>
    </div>
    </div>
  );
}

export default InterviewSelector;