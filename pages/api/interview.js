import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Lee el contenido del archivo .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');

// Parsea el contenido y establece las variables de entorno
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

console.log("Cargando API key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Almacenamos las preguntas realizadas en un objeto para cada sesión
const askedQuestions = {};

export default async function handler(req, res) {  // Añade 'async' aquí
  console.log('Método de la solicitud:', req.method);
  console.log('Cuerpo de la solicitud:', req.body);
  
  if (req.method === 'POST') {
    try {
      const { 
        interviewType, 
        level, 
        currentQuestionIndex, 
        technologies, 
        userAnswer, 
        isGenericQuestion,
        totalQuestions,
        userName
      } = req.body;

      console.log("Recibida solicitud:", { 
        interviewType, 
        level, 
        currentQuestionIndex, 
        technologies, 
        userAnswer, 
        isGenericQuestion, 
        totalQuestions, 
        userName 
      });

      // Creamos una clave única para cada sesión de entrevista
      const sessionKey = `${interviewType}-${level}`;

      if (userAnswer === undefined) {
        console.log("Generando nueva pregunta...");

        // Inicializamos el array de preguntas para esta sesión si no existe
        if (!askedQuestions[sessionKey]) {
          askedQuestions[sessionKey] = [];
        }

        const prompt = isGenericQuestion
          ? `Genera una pregunta genérica sobre ${interviewType} para un nivel ${level}.`
          : `Genera una pregunta específica sobre ${technologies[currentQuestionIndex % technologies.length]} para un nivel ${level}.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: `Eres un entrevistador experto en ${interviewType}. ${prompt} Esta es la pregunta ${currentQuestionIndex + 1} de ${totalQuestions}.`
          }],
          max_tokens: 100,
        });

        const newQuestion = completion.choices[0].message.content.trim();

        // Añadimos la nueva pregunta a la lista de preguntas realizadas
        askedQuestions[sessionKey].push(newQuestion);

        res.status(200).json({ message: newQuestion, score: null });
      } else {
        console.log("Evaluando respuesta...");
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Eres un recruiter innovador de una empresa de IT muy importante, evaluando a ${userName} para una posición de ${interviewType} de nivel ${level}. 
              Evalúa la siguiente respuesta de manera justa pero exigente. 
              Proporciona una puntuación del 1 al 5 y un feedback constructivo y específico. 
              El feedback debe comenzar con "${userName}, " seguido de un comentario sobre los puntos fuertes de la respuesta y luego "quizás podrías mejorar en" seguido de sugerencias concretas para mejorar o expandir la respuesta.`
            },
            { role: "user", content: userAnswer }
          ],
        });

        const aiResponse = completion.choices[0].message.content;
        const score = parseInt(aiResponse.match(/\d+/)[0]);
        
        res.status(200).json({ message: aiResponse, score: score });
      }
    } catch (error) {
      console.error('Error en la API:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  };
}