import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import OpenAI from 'openai';


export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  

  const chunks = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', async () => {
    try {
      const buffer = Buffer.concat(chunks);
      console.log()
      const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
      const parts = buffer.toString('binary').split(`--${boundary}`);

      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      let transcription = null;
      for (const part of parts) {
        if (part.includes('Content-Disposition')) {
          const [meta, ...rawContent] = part.split('\r\n\r\n');
          const content = rawContent.join('\r\n\r\n').trim();

          if (meta.includes('filename') && meta.includes('audio')) {
            console.log('DATA RECIBIDA CON AUDIO')
            // Obtener el nombre de archivo
            const matches = meta.match(/filename="(.+)"/);
            const contentTypeMatch = meta.match(/Content-Type: (.+)/);
            if (contentTypeMatch) {
              const contentType = contentTypeMatch[1].trim();
              console.log('Tipo de contenido recibido:', contentType);
            }
            const filename = matches && matches[1];

            // Elimina los delimitadores de línea del contenido
            const cleanedContent = content.slice(0, content.length - 2);
            const filePath = path.join(uploadsDir, filename);

            // Escriba el contenido en el archivo en binario
            fs.writeFileSync(filePath, Buffer.from(cleanedContent, 'binary'));

            // Leer el archivo como un stream
            const fileStream = fs.createReadStream(filePath);
            fileStream.on('open', () => {
              console.log('El archivo se está leyendo correctamente.');
          });
          fileStream.on('error', (err) => {
              console.error('Error al leer el archivo:', err);
          });
            // Obtener la transcripción del archivo de audio
            const response = await openai.audio.transcriptions.create({
              file: fileStream,
              model: "whisper-1",
            });

            transcription = response.text
            res.status(200).json({respuesta: response.text})
            console.log(transcription)

            // Eliminar el archivo guardado localmente después de obtener la transcripción
            fs.unlinkSync(filePath);
          }
        }
      }

      if (transcription) {
        res.status(200).json({ transcription });
      } else {
        res.status(500).json({ error: 'Failed to obtain transcription' });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  });

  req.on('error', (err) => {
    res.status(500).json({ error: 'Failed to save data' });
  });
}