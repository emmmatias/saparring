import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import ErrorIcon from '@mui/icons-material/Error';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ScoreIcon from '@mui/icons-material/Score';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

function getEmojiForScore(score) {
  if (score === 5) return <StarIcon sx={{ color: 'gold' }} />;
  if (score === 4) return <StarIcon sx={{ color: 'silver' }} />;
  if (score === 3) return <StarIcon sx={{ color: 'bronze' }} />;
  if (score === 2) return <StarIcon sx={{ color: 'error.main' }} />;
  return <StarIcon sx={{ color: 'error.dark' }} />;
}

function ChatArea2({ interviewType, technologies, level, userName, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [processedFeedback, setProcessedFeedback] = useState({
    summary: '',
    strengths: [],
    areasToImprove: [],
    recommendations: []
  });

  const totalQuestions = Math.min(10, Math.max(5, technologies.length));

  const pdfRef = useRef(null);

  useEffect(() => {
    getNextQuestion();
  }, []);

  useEffect(() => {
    if (overallFeedback) {
      const feedbackParts = overallFeedback.split('\n\n');
      setProcessedFeedback({
        summary: feedbackParts[0] || '',
        strengths: feedbackParts[1]?.replace('Puntos fuertes:', '').split('- ').filter(Boolean) || [],
        areasToImprove: feedbackParts[2]?.replace('Áreas de mejora:', '').split('- ').filter(Boolean) || [],
        recommendations: feedbackParts[3]?.replace('Recomendaciones:', '').split('- ').filter(Boolean) || []
      });
    }
  }, [overallFeedback]);

  const getNextQuestion = async () => {
    if (currentQuestionIndex >= totalQuestions) {
      await getFinalFeedback();
      setIsFinished(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          interviewType, 
          technologies,
          level, 
          userName,
          currentQuestionIndex,
          totalQuestions
        }),
      });

      const data = await response.json();
      setQuestions(prevQuestions => [...prevQuestions, { question: data.message, answer: '', feedback: '', score: null }]);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      console.error("Error al obtener la siguiente pregunta:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    setIsLoading(true);
    try {
      const currentQuestion = questions[currentQuestionIndex - 1];
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: currentQuestion.question,
          answer: input,
          interviewType, 
          technologies,
          level, 
          userName
        }),
      });

      const data = await response.json();
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        newQuestions[currentQuestionIndex - 1] = { 
          ...newQuestions[currentQuestionIndex - 1], 
          answer: input,
          feedback: data.feedback,
          score: data.score
        };
        return newQuestions;
      });

      setInput('');
      getNextQuestion();
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
    }
    setIsLoading(false);
  };

  const getFinalFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/final-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questions, 
          interviewType, 
          technologies,
          level, 
          userName
        }),
      });

      const data = await response.json();
      setOverallFeedback(data.feedback);
    } catch (error) {
      console.error("Error al obtener el feedback final:", error);
    }
    setIsLoading(false);
  };

  const downloadPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { 
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('sparring_tecnico_resumen.pdf');
  };

  if (isFinished) {
    return (
      <>
        <Box ref={pdfRef} sx={{ p: 2, maxWidth: '800px', margin: 'auto' }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
            ¡Sparring técnico finalizado!
          </Typography>
          <Typography variant="body1" paragraph>
            Gracias por participar, {userName}. Aquí tienes un resumen detallado de tu sparring técnico:
          </Typography>
          
          {questions.map((q, index) => (
            <Paper elevation={3} sx={{ mb: 3, p: 2 }} key={index}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1, color: 'secondary.main' }} />
                Pregunta {index + 1}
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Pregunta:</strong> {q.question}</Typography>
              <Typography variant="body2" gutterBottom><strong>Tu respuesta:</strong> {q.answer}</Typography>
              <Typography variant="body2" gutterBottom><strong>Feedback:</strong> {q.feedback}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getEmojiForScore(q.score)}
                <Typography variant="body2" sx={{ ml: 0.5 }}><strong>Puntuación:</strong> {q.score}/5</Typography>
              </Box>
            </Paper>
          ))}
          
          <Paper elevation={3} sx={{ mt: 4, mb: 3, p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
              Feedback General y Recomendaciones:
            </Typography>
            <Typography variant="body1" paragraph>{processedFeedback.summary}</Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ mr: 1, color: 'success.main' }} />
              Puntos fuertes:
            </Typography>
            <List>
              {processedFeedback.strengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
              Áreas de mejora:
            </Typography>
            <List>
              {processedFeedback.areasToImprove.map((area, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ErrorOutlineIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary={area} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon sx={{ mr: 1, color: 'warning.main' }} />
              Recomendaciones:
            </Typography>
            <List>
              {processedFeedback.recommendations.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <EmojiObjectsIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={downloadPDF} 
            startIcon={<DownloadIcon />}
          >
            Descargar Resumen PDF
          </Button>
          <Button variant="outlined" color="secondary" onClick={onRestart} startIcon={<RefreshIcon />}>
            Reiniciar Sparring Técnico
          </Button>
        </Box>
      </>
    );
  }

  
}

export default ChatArea2;