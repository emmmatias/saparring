import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio'
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

  export default async function handler(req, res) {
    if (req.method === 'GET') {
        let { url } = req.query;
        console.log('url:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo acceder al sitio: ' + response.statusText);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Extraer texto solo de etiquetas específicas
            const textContent = [];
            $('p, div, li, ul, h1, h2, h3, h4, h5, h6, section').each((index, element) => {
                const text = $(element).text().trim();
                if (text) {
                    textContent.push(text);
                }
            });

            // Unir todos los textos en un solo string
            const cleanedText = textContent.join(' ').replace(/\s+/g, ' ').trim();

            console.log(cleanedText);

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                  role: "system",
                  content: "Eres un experto en entrevistas técnicas. Basándote en los requisitos de la oferta de trabajo, sugiere un tipo de entrevista (Frontend, Backend, Fullstack, DevOps, o Mobile), una lista de tecnologías relevantes, y un nivel (Junior, Intermedio, Senior). Responde en formato JSON con las claves 'interviewType', 'technologies' (array), y 'level'."
                },
                {
                  role: "user",
                  content: `Basándote en estos requisitos de trabajo, sugiere un tipo de entrevista, tecnologías y nivel: ${cleanedText}`
                }],
                temperature: 0.7,
                max_tokens: 150,
              });

              let responseContent = completion.choices[0].message.content;
              console.log('Respuesta de OpenAI:', responseContent);
              responseContent = responseContent.replace(/```json\n|\n```/g, '');
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
            console.error('Error al hacer la solicitud:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
}