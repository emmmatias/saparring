import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
import nodemailer from 'nodemailer';
const SECRET_KEY = process.env.JWT_SECRET;
let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if (req.method === 'POST') {

        let data = JSON.parse(req.body) 
        let {mail} = data

        try{
            await connection.query(`CREATE TABLE IF NOT EXISTS candidatos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre TEXT,
                apellido TEXT,
                puesto TEXT,
                tecnologias TEXT,
                situacion TEXT,
                oferta TEXT,
                mail VARCHAR(50) NOT NULL UNIQUE,
                contraseña TEXT,
                pruebas TEXT,
                feedbacks TEXT,
                autorizado BOOLEAN,
                mail_verificado BOOLEAN,
                config TEXT
                )`)

                let [rows] = await connection.query(`SELECT * FROM candidatos WHERE mail = ?`, [mail])

                if(rows.length > 0){
                // Crear el token
                const token = jwt.sign({ mail }, SECRET_KEY, { expiresIn: '4h' });
            
                let html = `
                <div class="container">
        <div class="header">
            <svg style="width: 64px; height: 64px; color: #485fc7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path fill="currentColor" d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/>
            </svg>
        </div>
        
        <div class="content">
            <h1>Acceso a Sparring</h1>
            
            <div class="info-box">
                <p>Has solicitado acceder a tu cuenta en Sparring. Haz clic en el botón para iniciar sesión de forma segura:</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/dash_user?token=${token}" class="button">Acceder a Sparring</a>
            </div>

            <div class="security-note">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>Este enlace es válido por 5 minutos</li>
                    <li>Solo funciona una vez</li>
                    <li>Es personal e intransferible</li>
                </ul>
            </div>
            
            <p>Si el enlace ha expirado, puedes solicitar uno nuevo en:</p>
            <p style="text-align: center;">
                <a href="${BaseUrl}/api/verify?token=${token}" class="highlight">sparring.dev/talento</a>
            </p>

            <p>Si no has solicitado este acceso, puedes ignorar este correo o contactarnos en <a href="mailto:hola@sparring.dev" class="highlight">hola@sparring.dev</a></p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${mail}</p>
            <p>Fecha de solicitud: ${new Date().toString()}</p>
        </div>
    </div>
                `

                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_SERVER, 
                    port: process.env.SMTP_PORT, 
                    secure: false, 
                    auth: {
                        user: process.env.SMTP_USERNAME,
                        pass: process.env.SMTP_PASSWORD
                    }
                })

                const mailOptions = {
                    from: process.env.SMTP_USERNAME, 
                    to: mail, 
                    subject: 'Bienvenido a Sparring',
                    text: 'Contenido del correo en texto plano', 
                    html, 
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log('Error al enviar el correo: ', error);
                    }
                    console.log('Correo enviado: ' + info.response);
                })

                // Establecer la cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 4,
                    path: '/'
                }));

                    res.status(200).json({candidato: rows[0], message: 'Enviamos un mail para que ingreses a tu cuenta'})
                }else{
                    return res.status(404).json({ message: 'email inválido' }); 
                }

        }catch(error){
            console.error(error)
            return res.status(500).json({ error: 'error al conectar con la base de datos' });
        }
    }else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no válido' });
    }
}

export default handler