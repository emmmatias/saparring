import nodemailer from 'nodemailer';
import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;

let BaseUrl = process.env.BASE_URL

const notificar = (nombre, apellido, mail, token, id_prueba, recluter) => {

    const html = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso a prueba técnica en Sparring</title>
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
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table td {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
        }
        .details-table td:first-child {
            font-weight: bold;
            width: 40%;
            color: #485fc7;
        }
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg style="width: 64px; height: 64px; color: #485fc7;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
            </svg>
        </div>
        
        <div class="content">
            <h1>Acceso a tu prueba técnica</h1>
            
            <p>Has sido invitado a realizar una prueba técnica en Sparring. Aquí tienes los detalles:</p>
            
            <table class="details-table">
                <tr>
                    <td>ID de la prueba</td>
                    <td>${id_prueba}</td>
                </tr>
                <tr>
                    <td>Creado por</td>
                    <td>${recluter}</td>
                </tr>
                <tr>
                    <td>Fecha de creación</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            </table>
            
            <div style="text-align: center;">
                <a style="color: white;" href="${BaseUrl}/talent?prueba_id=${id_prueba}&token=${token}&mail=${mail}" class="button">Comenzar prueba</a>
            </div>

            <div class="info-box">
                <strong>⚠️ Importante:</strong>
                <p>Si el enlace ha expirado o tienes problemas para acceder:</p>
                <ol>
                    <li>Visita <a href="https://sparring.dev/talento" class="highlight">sparring.dev/talento</a></li>
                    <li>Introduce tu correo electrónico</li>
                    <li>Recibirás un nuevo correo con un enlace de acceso</li>
                </ol>
            </div>
            
            <p>¡Mucha suerte en tu prueba!</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${mail}</p>
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
    });
    
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

}

const handler = async (req, res) => {
    if(req.method == 'POST'){
        let data = await JSON.parse(req.body)
        const {
            nombre,
        apellido,
        emailCandidato,
        categorias,
        linkedCv,
        tecnologias,
        comentarios,
        id_prueba,
        recluter
        } = data
        console.log(data)

        let tecnologias2 = {tecnologias: [...tecnologias]}
        let feedbacks = {feedbacks:[]}
        let config = {
            linkedin: linkedCv || '',
            comentarios: comentarios.length > 0 ? `${comentarios}` : ``,
            categorias
        }

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
            pruebas TEXT,
            feedbacks TEXT,
            autorizado BOOLEAN,
            mail_verificado BOOLEAN,
            config TEXT
            )`)

        let [rows] = await connection.query(`SELECT * FROM candidatos WHERE mail = ?`, [emailCandidato])
        if(rows.length > 0){
            console.log('sssss', rows[0])
            let tecnologias_arr = JSON.parse(rows[0].tecnologias).tecnologias
            let pruebas_arr = JSON.parse(rows[0].pruebas).pruebas
            let feedbacks_arr = JSON.parse(rows[0].feedbacks).feedbacks
            let config = JSON.parse(rows[0].config)
            let config_linkedin = config.linkedin
            let config_comentarios = config.comentarios
            let config_categorias = config.categorias
            let nuevas_tecnologias = [...new Set([...tecnologias_arr, ...tecnologias])]
            let nueva_config = {
                linkedin: config_linkedin,
                comentarios: `${config_comentarios}, ${comentarios}`,
                categorias: [...config_categorias, ...categorias]
            }
            let nuevos_feedbacks = [...feedbacks_arr]
            let nuevas_pruebas = [...new Set([...pruebas_arr, id_prueba])]

            await connection.query(`UPDATE candidatos SET config = ?, pruebas = ?, tecnologias = ? WHERE mail = ?`, [ JSON.stringify(nueva_config),JSON.stringify({pruebas: nuevas_pruebas}), JSON.stringify({tecnologias: nuevas_tecnologias}) , emailCandidato])
            
            const token = jwt.sign({ mail: emailCandidato, nombre, apellido, tipo: 'candidato' }, SECRET_KEY, { expiresIn: '8h' })

            notificar(nombre, apellido, emailCandidato, token, id_prueba, recluter)
            
            res.status(200).json({message: 'Se ha enviado un mail de invitacion a la prueba'})
        }
        if(rows.length == 0){
            
            await connection.query(`INSERT INTO candidatos (
                nombre,
                apellido,
                puesto,
                tecnologias,
                situacion,
                oferta,
                mail,
                pruebas,
                feedbacks,
                autorizado,
                mail_verificado,
                config) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                `, [nombre, apellido, '', JSON.stringify(tecnologias2), '', '', emailCandidato, JSON.stringify({pruebas: [id_prueba]}), JSON.stringify(feedbacks), 1, 1, JSON.stringify(config)])
            
                const token = jwt.sign({ mail: emailCandidato, nombre, apellido, tipo: 'candidato' }, SECRET_KEY, { expiresIn: '8h' })

                notificar(nombre, apellido, emailCandidato, token, id_prueba, recluter)
        
                res.status(200).json({message: 'El candidato fue dado de alta y se ha enviado un mail de invitacion a la prueba'})        

        }}catch(error){
            console.error(error)
            res.status(402).json({ message: 'error al intentar concetase con la vase de datos '})
        }
        
    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}


export default handler