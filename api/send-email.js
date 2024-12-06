import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Configurar el transporte de correo
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Configurar el correo
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    html: `<p><strong>Nombre:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Mensaje:</strong> ${message}</p>`,
  };

  try {
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
  }
}
