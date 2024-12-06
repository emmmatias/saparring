import connection from "./db";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;
let BaseUrl = process.env.BASE_URL


const handler = async (req, res) => {
    if (req.method === 'POST') {
        let data = JSON.parse(req.body) 
        let {email_admin, contraseña} = data
        //el cif esta en contraseña
        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS empresas (
                id TEXT,
                empresa TEXT,
                cif TEXT,
                direccion TEXT,
                codigopostal TEXT,
                provincia TEXT,
                ciudad TEXT,
                telefono_contacto TEXT,
                email_contacto TEXT,
                email_admin TEXT,
                logo TEXT,
                web TEXT,
                reclutadores TEXT,
                activo BOOLEAN,
                mail_verificado BOOLEAN,
                contraseña TEXT
                )`)

            //const [rows] = await connection.query('SELECT * FROM empresas WHERE cif = ? AND email_admin = ?', [contraseña,  email_admin]);

            /*if (rows.length > 0) {
                const data_user = rows[0];
                if(data_user.activo == true){
                    const token = jwt.sign({ email_admin }, SECRET_KEY, { expiresIn: '4h' });
                                    // Establecer la cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 4,
                    path: '/'
                }))

                 const html_empresa_login = `
                 <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta en Sparring</title>
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
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg style="width: 64px; height: 64px; color: #485fc7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path fill="currentColor" d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/>
            </svg>
        </div>
        
        <div class="content">
            <h1>Accede a tu cuenta en Sparring</h1>
            
            <p>Has solicitado iniciar sesión en Sparring. Utiliza el siguiente enlace para acceder a tu cuenta:</p>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/api/verify2?token=${token}" class="button">Iniciar sesión</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace solo será válido durante los próximos 5 minutos por razones de seguridad.
            </div>
            
            <p>Si no has solicitado este acceso, puedes ignorar este correo o contactarnos en <a href="mailto:hola@sparring.dev" class="highlight">hola@sparring.dev</a></p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${email_admin}</p>
            <p>Fecha de solicitud: ${new Date().toString()}</p>
        </div>
    </div>
</body>
</html> 
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
                    to: email_admin, 
                    subject: 'Bienvenido a Sparring',
                    text: 'Contenido del correo en texto plano', 
                    html: html_empresa_login, 
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log('Error al enviar el correo: ', error);
                    }
                    console.log('Correo enviado: ' + info.response);
                })

                // Enviar la respuesta de redirección
                return res.status(200).json({ message: 'Usuario_encontrado' });
                }else{
                    if(data_user.mail_verificado == false){
                        return res.status(404).json({ message: 'Debes verificar tu email' });
                    }else{
                        return res.status(404).json({ message: 'Estamos validando tu cuenta' });
                    }  
                }
            } else {*/
                //alta con usuario de recluiter, buscamos toso los reclutadores
                const [rows] = await connection.query('SELECT reclutadores FROM empresas WHERE cif = ?', [contraseña])
                if (rows.length > 0){
                    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', JSON.parse(rows[0].reclutadores).reclutadores)
                    let reclutadores = JSON.parse(rows[0].reclutadores).reclutadores
                    console.log('')
                    let mails = reclutadores.filter(el => {
                        console.log('el.reclutador_email',el.reclutador_email)
                        console.log('email_admin', email_admin)
                        return(el.reclutador_email == email_admin)
                    })
                    console.log('5555555555555555555555555555555555', mails)
                    /////////////////////////
                    if(mails.length > 0){
                        const [rows] = await connection.query('SELECT * FROM empresas WHERE cif = ?', [contraseña])
                        const data_user = rows[0];
                if(data_user.activo == true){
                    const token = jwt.sign({ email_admin: data_user.email_admin, recluiter: email_admin}, SECRET_KEY, { expiresIn: '4h' });
                                    // Establecer la cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 60 * 60 * 4,
                    path: '/'
                }))
                let loginurl = `${BaseUrl}/api/verify2?token=${token}`
                console.log('ENVIANDO MAIL: ', loginurl)
                 const html_empresa_login = `
                 <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta en Sparring</title>
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
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg style="width: 64px; height: 64px; color: #485fc7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/>
            </svg>
        </div>
        
        <div class="content">
            <h1>Accede a tu cuenta en Sparring</h1>
            
            <p>Has solicitado iniciar sesión en Sparring. Utiliza el siguiente enlace para acceder a tu cuenta:</p>
            <div style="text-align: center;">
                <button class="button">
                <a href="${loginurl}" style="color: white;">Iniciar sesión</a>
                </button>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace solo será válido durante los próximos 5 minutos por razones de seguridad.
            </div>
            
            <p>Si no has solicitado este acceso, puedes ignorar este correo o contactarnos en <a href="mailto:hola@sparring.dev" class="highlight">hola@sparring.dev</a></p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${data_user.email_admin}</p>
            <p>Fecha de solicitud: ${new Date().toString()}</p>
        </div>
    </div>
</body>
</html> 
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
                    to: email_admin, 
                    subject: 'Bienvenido a Sparring',
                    text: 'Contenido del correo en texto plano', 
                    html: html_empresa_login, 
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log('Error al enviar el correo: ', error);
                    }
                    console.log('Correo enviado: ' + info.response);
                })

                // Enviar la respuesta de redirección
                return res.status(200).json({ message: 'Usuario_encontrado' });
                }else{
                    if(data_user.mail_verificado == false){
                        return res.status(404).json({ message: 'Debes verificar tu email' });
                    }else{
                        return res.status(404).json({ message: 'Estamos validando tu cuenta' });
                    }  
                }
                    }else{
                        return res.status(404).json({ message: 'Estamos validando tu cuenta' })
                    }
                    ////////////////////////
                //}
                
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }else{
                return res.status(404).json({ message: 'Usuario y/o cif incorrecto' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no válido' });
    }
};

export default handler;