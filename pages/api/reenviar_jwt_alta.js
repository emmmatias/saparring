import connection from "./db";
import jwt, { decode } from 'jsonwebtoken';
import * as cookie from 'cookie'
import nodemailer from 'nodemailer';
const SECRET_KEY = process.env.JWT_SECRET
let BaseUrl = process.env.BASE_URL

const notificar_alta = (email_admin, empresa, token) => {

    let html = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Sparring</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 6px 6px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 0 0 6px 6px;
            box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1);
        }
        .logo {
            width: 150px;
            height: auto;
        }
        .button {
            display: inline-block;
            background-color: #485fc7;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 0.9em;
        }
        .highlight {
            color: #485fc7;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg style="width: 64px; height: 64px; color: #485fc7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path fill="currentColor" d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"/>
            </svg>
        </div>
        
        <div class="content">
            <h1>¡Bienvenido a Sparring, ${empresa}!</h1>
            
            <p>Nos alegra que hayas decidido unirte a nuestra plataforma de entrevistas técnicas impulsada por IA.</p>
            
            <p>Para comenzar a utilizar todas las funcionalidades de Sparring, necesitamos verificar tu cuenta:</p>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/api/verify2?token=${token}" class="button">Verificar mi cuenta</a>
            </div>
            
            <p>Una vez verificada tu cuenta, podrás:</p>
            <ul>
                <li>Configurar tus preferencias de entrevistas</li>
                <li>Crear pruebas técnicas personalizadas</li>
                <li>Gestionar tu equipo de reclutamiento</li>
                <li>Acceder a nuestras plantillas predefinidas</li>
            </ul>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:hola@sparring.dev" class="highlight">hola@sparring.dev</a></p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${email_admin}</p>
        </div>
    </div>
</body>
    </html> `

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER, 
        port: process.env.SMTP_PORT, 
        secure: false, 
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USERNAME, 
        to: email_admin, 
        subject: 'Bienvenido a Sparring',
        text: 'Contenido del correo en texto plano', 
        html, 
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error al enviar el correo: ', error);
        }
        console.log('Correo enviado: ' + info.response);
    });

}

const handler = async (req, res) => {

    const { email_admin, empresa } = req.query

    try{

        const token = jwt.sign({ email_admin, empresa }, SECRET_KEY, { expiresIn: '5m' })
        
        if(email_admin && empresa){
            notificar_alta(email_admin, empresa, token)
            return res.status(200).json({ message: 'Revisa tu correo electrónico' })  
        }else{
            return res.status(404).json({ message: 'Hubo un error' })  
        }

    }catch(error){

        return res.status(400).json({ message: `Hubo un error:  ${error}` }) 

    }

}

export default handler