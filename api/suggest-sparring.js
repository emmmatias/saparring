import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { jobRequirements } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Eres un experto en entrevistas técnicas. Basándote en los requisitos de la oferta de trabajo, sugiere un tipo de entrevista (Frontend, Backend, Fullstack, DevOps, o Mobile), una lista de tecnologías relevantes, y un nivel (Junior, Intermedio, Senior). Responde en formato JSON con las claves 'interviewType', 'technologies' (array), y 'level'."
        },
        {
          role: "user",
          content: `Basándote en estos requisitos de trabajo, sugiere un tipo de entrevista, tecnologías y nivel: ${jobRequirements}`
        }],
        temperature: 0.7,
        max_tokens: 150,
      });

      let responseContent = completion.choices[0].message.content;
      console.log('Respuesta de OpenAI:', responseContent); // Añade este log

      // Eliminar los marcadores de código Markdown si están presentes
      responseContent = responseContent.replace(/```json\n|\n```/g, '');

      // Intentar analizar el JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('Error al analizar la respuesta JSON:', parseError);
        // Si falla el análisis, intentar extraer la información manualmente
        const interviewTypeMatch = responseContent.match(/interviewType"?\s*:\s*"([^"]+)"/);
        const technologiesMatch = responseContent.match(/technologies"?\s*:\s*\[(.*?)\]/);
        const levelMatch = responseContent.match(/level"?\s*:\s*"([^"]+)"/);

        parsedResponse = {
          interviewType: interviewTypeMatch ? interviewTypeMatch[1] : '',
          technologies: technologiesMatch ? technologiesMatch[1].split(',').map(t => t.trim().replace(/"/g, '')) : [],
          level: levelMatch ? levelMatch[1] : ''
        };
      }

      if (!parsedResponse.interviewType || !parsedResponse.technologies || !parsedResponse.level) {
        throw new Error('Respuesta incompleta de OpenAI');
      }

      res.status(200).json(parsedResponse);
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
