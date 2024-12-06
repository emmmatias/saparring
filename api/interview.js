import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import Cors from 'cors';


console.log("Cargando API key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Inicializa el middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

// Almacenamos las preguntas realizadas en un objeto para cada sesión
const askedQuestions = {};

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  console.log('Método de la solicitud:', req.method);
  console.log('Cuerpo de la solicitud:', JSON.stringify(req.body));
  
  if (req.method === 'POST') {
    try {
      const { 
        interviewType, 
        level, 
        currentQuestionIndex, 
        technologies, 
        totalQuestions,
        userName
      } = req.body;

      console.log("Datos recibidos:", { 
        interviewType, 
        level, 
        currentQuestionIndex, 
        technologies, 
        totalQuestions, 
        userName 
      });

      console.log("Iniciando solicitud a OpenAI...");
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Eres un entrevistador experto en ${interviewType}. Genera una pregunta específica sobre ${technologies[currentQuestionIndex % technologies.length]} para un nivel ${level}. Esta es la pregunta ${currentQuestionIndex + 1} de ${totalQuestions}.`
        }],
        max_tokens: 100,
      });
      console.log("Respuesta de OpenAI recibida");

      const newQuestion = completion.choices[0].message.content.trim();
      console.log("Nueva pregunta generada:", newQuestion);

      res.status(200).json({ message: newQuestion, score: null });
    } catch (error) {
      console.error('Error detallado:', error);
      res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  };
}