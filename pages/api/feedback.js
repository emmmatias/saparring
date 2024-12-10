import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Recibida solicitud de feedback:', req.body);
    const { question, answer, interviewType, technologies, level, userName } = req.body;

    if (!question || !answer) {
      console.error('Faltan datos en la solicitud');
      return res.status(400).json({ error: 'Faltan datos necesarios en la solicitud' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${userName} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${technologies.join(', ')}.

          En tu evaluación:
          1. Proporciona un feedback constructivo y empático.
          2. Identifica puntos fuertes y áreas de mejora en la respuesta.
          3. Ofrece sugerencias concretas para mejorar la respuesta o profundizar en el tema.
          4. Asigna una puntuación del 1 al 5 basada en la calidad y precisión de la respuesta, donde:
             1 = Muy deficiente o sin respuesta
             2 = Deficiente, con errores significativos
             3 = Aceptable, pero con áreas de mejora claras
             4 = Buena, con algunos puntos menores para mejorar
             5 = Excelente, respuesta completa y precisa
          
          Sé justo y preciso en tu evaluación. Si la respuesta es "No lo sé" o similar, la puntuación debe reflejar esta falta de conocimiento.
          
          IMPORTANTE: Incluye siempre la puntuación al final del feedback en el formato 'Puntuación: X', donde X es un número del 1 al 5.`
        },
        {
          role: "user",
          content: `Pregunta: ${question}\n\nRespuesta: ${answer}`
        }],
        max_tokens: 500,
      });

      const feedbackContent = completion.choices[0].message.content.trim();
      console.log('Feedback recibido de OpenAI:', feedbackContent);

      const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/);
      let score;
      if (scoreMatch && scoreMatch[1]) {
        score = parseInt(scoreMatch[1], 10);
        if (score < 1 || score > 5) {
          console.warn('Puntuación fuera de rango:', score);
          score = Math.max(1, Math.min(5, score)); // Asegura que la puntuación esté entre 1 y 5
        }
      } else {
        console.warn('No se pudo extraer la puntuación del feedback. Asignando puntuación por defecto.');
        score = 1; // Puntuación por defecto si no se puede extraer
      }

      console.log('Puntuación extraída:', score);

      res.status(200).json({ feedback: feedbackContent, score });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
