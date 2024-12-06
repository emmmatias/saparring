import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { questions, interviewType, technologies, level, userName } = req.body;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Eres un experto en entrevistas técnicas para ${interviewType}. Proporciona un feedback general detallado para ${userName} basado en sus respuestas a las siguientes preguntas. El nivel del candidato es ${level}. Las tecnologías evaluadas fueron: ${technologies.join(', ')}. 
          
          Incluye lo siguiente en tu feedback:
          1. Un resumen general del desempeño.
          2. Puntos fuertes identificados.
          3. Áreas específicas de mejora.
          4. Recomendaciones concretas para prepararse mejor para futuras entrevistas.
          5. Sugerencias de recursos o tecnologías para estudiar.
          
          Sé constructivo y motivador en tu feedback, pero también honesto sobre las áreas que necesitan mejora.`
        },
        {
          role: "user",
          content: questions.map((q, i) => `Pregunta ${i + 1}: ${q.question}\nRespuesta: ${q.answer}\nPuntuación: ${q.score}/5`).join('\n\n')
        }],
        max_tokens: 1000,
      });

      res.status(200).json({ feedback: completion.choices[0].message.content.trim() });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
