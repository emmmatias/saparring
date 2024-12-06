import nodemailer from 'nodemailer';
import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;
let BaseUrl = process.env.BASE_URL

const extraercomentario = (texto) => {
    const regex = /<comentario>(.*?)<comentario>/g
    const resultados = [];
    let match;

while ((match = regex.exec(texto)) !== null) {
    resultados.push(match[1])
}

return resultados;
}

function extraerTextos(texto) {
    const regex = /@([^@]+)@/g;
    const textoArray = [];
    let coincidencia;
  
    while ((coincidencia = regex.exec(texto))) {
      textoArray.push(coincidencia[1].trim());
    }
  
    return textoArray;
  }

const notificar = (mail, candidato, id_prueba, empresa, fecha, token) => {
    let html = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu feedback está disponible - Sparring</title>
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
            background-color: #f8f9fa;
            border-radius: 4px;
            overflow: hidden;
        }
        .details-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
        }
        .details-table td:first-child {
            font-weight: bold;
            width: 40%;
            color: #485fc7;
        }
        .feedback-box {
            background-color: #f0f7ff;
            border: 1px solid #cce5ff;
            border-radius: 4px;
            padding: 20px;
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
            <h1>¡${candidato}, tu feedback está disponible!</h1>
            
            <div class="feedback-box">
                <h2 style="margin-top: 0;">Prueba Técnica ${id_prueba}</h2>
                <p>El equipo de ${empresa} ha revisado tu prueba y ha dejado sus comentarios y valoración.</p>
            </div>
            
            <table class="details-table">
                <tr>
                    <td>ID de la prueba</td>
                    <td>${id_prueba}</td>
                </tr>
                <tr>
                    <td>Empresa</td>
                    <td>${empresa}</td>
                </tr>
                <tr>
                    <td>Fecha de revisión</td>
                    <td>${fecha}</td>
                </tr>
            </table>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/api/enviarfeedback?id=${id_prueba}&candidato=${mail}&token=${token}" class="button" style="color: white;">Ver mi feedback</a>
            </div>
            <p>En tu feedback encontrarás:</p>
            <ul>
                <li>Valoración detallada de tu código</li>
                <li>Comentarios específicos sobre tu solución</li>
                <li>Áreas de mejora identificadas</li>
                <li>Puntos fuertes destacados</li>
            </ul>
            
            <p>Recuerda que este feedback es una herramienta valiosa para tu crecimiento profesional. ¡Aprovéchalo!</p>
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
    })
    
    const mailOptions2 = {
        from: process.env.SMTP_USERNAME, 
        to: mail, 
        subject: 'Tu feedbaack disponible',
        text: 'Contenido del correo en texto plano', 
        html: html, 
    } 
    
    transporter.sendMail(mailOptions2, (err, info) => {
        if(err){
            console.error(err)
        }else{
            console.log('mail enviado')
        }
    })
}

const extraerpuntos_fuertes = (texto) => {
    const regex = /<punto fuerte>(.*?)<punto fuerte>/g
    const resultados = [];
    let match;

while ((match = regex.exec(texto)) !== null) {
    resultados.push(match[1])
}
let r = resultados.filter(el => {el == 'punto fuerte identificado'})
return resultados;
}
const extraerpuntos_debiles = (texto) => {
    const regex = /<punto debil>(.*?)<punto debil>/g
    const resultados = [];
    let match;

while ((match = regex.exec(texto)) !== null) {
    resultados.push(match[1])
}
let r = resultados.filter(el => {el != 'punto debil identificado'})
return resultados;
}
const extraerpuntos_comntarios = (texto) => {
    const regex = /<comentario>(.*?)<comentario>/g
    const resultados = [];
    let match;

while ((match = regex.exec(texto)) !== null) {
    resultados.push(match[1])
}

return resultados;
}
const extraerpuntos_sugerencias = (texo) => {
    const regex = /<sugerencia>(.*?)<sugerencia>/g
    const resultados = [];
    let match;

while ((match = regex.exec(texto)) !== null) {
    resultados.push(match[1])
}

return resultados;
}

const handler = async (req, res) => {
    if(req.method === 'POST'){
       const {mail, candidato, id_prueba, empresa, fecha} = await JSON.parse(req.body)
       const token = jwt.sign({mail, candidato, id_prueba, empresa}, SECRET_KEY, { expiresIn: '4h' })
       notificar(mail, candidato, id_prueba, empresa, fecha, token)
       res.status(200).json({message: 'Mail enviado'})
    }else if(req.method === 'GET'){
        const { id , candidato, token } = req.query
        const [rows] = await connection.query('SELECT respuestas.*, pruebas.config FROM respuestas JOIN pruebas ON respuestas.id_prueba = pruebas.id WHERE respuestas.id_respuesta = ?', [`${id}${candidato}`])
        if(rows.length > 0){
            let respuesta = rows[0]
            let config = JSON.parse(respuesta.config)
            console.log('++++++++++++++++++++++++++++++++++++++++++', config)
            let mensajes1 = config.contraseña
            console.log('++++++++++++MENENENENNENENE+++++++++++++++', respuesta.feedbacks)
            let mensajes = mensajes1.mensajes
            let puntos_fuertes = extraerpuntos_fuertes(respuesta.feedbacks)
            console.log(puntos_fuertes)
            let puntos_debiles = extraerpuntos_debiles(respuesta.feedbacks)
            let respuestas = extraerTextos(respuesta.feedbacks)
            let comentario = extraerpuntos_comntarios(respuesta.feedbacks)
            console.log('sssssssssssssssssssssssssssssss', comentario)
            //let comentarios = extraerpuntos_comntarios(respuesta.feedbacks)
            //let sugerencias = extraerpuntos_sugerencias(respuesta.feedbacks)
            let htmlstring = comentario.map((el, index) => {
                return `
                    <div style="margin-bottom: 2%;">
                        ${respuestas[index] ? `<div>Respuesta n°${index + 1}: ${respuestas[index].slice(0, 50)}</div>` : ''}
                        <div contenteditable="true" onblur="editarComentario(event, ${index})">${el}</div>
                    </div>
                `;
            }).join('');
            let html =  `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Feedback - Plataforma de Pruebas Técnicas</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .equal-height {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .equal-height .card {
            flex-grow: 1;
        }
        .test-info {
            margin-bottom: 2rem;
            padding: 1rem;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .feedback-section {
            margin-top: 3rem;
            padding: 2rem;
            background-color: #f0f8ff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .feedback-section h2 {
            color: #3273dc;
            margin-bottom: 1.5rem;
        }
        .feedback-content {
            font-size: 1.1rem;
            line-height: 1.6;
        }
        .feedback-highlight {
            background-color: #e6f3ff;
            padding: 1rem;
            border-left: 4px solid #3273dc;
            margin-top: 1rem;
        }
        .feedback-explanation {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #f0f8ff;
            border-radius: 4px;
            border-left: 4px solid #3273dc;
        }
        .feedback-explanation p {
            margin-bottom: 1rem;
        }
        .feedback-explanation p:last-child {
            margin-bottom: 0;
        }

        /* Estilos para el tooltip */
        .has-tooltip-multiline {
            position: relative;
            cursor: pointer;
        }

        .has-tooltip-multiline::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.5em;
            border-radius: 4px;
            font-size: 0.75rem;
            width: max-content;
            max-width: 200px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 10;
        }

        .has-tooltip-multiline:hover::after {
            opacity: 1;
        }

        /* Asegurarse de que el icono sea visible */
        .icon.is-small {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 1.5rem;
            width: 1.5rem;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container" id="content">
        <h1 class="title has-text-centered mt-4">Área de Candidato</h1>
        <section class="section">
            <div class="container">
                <h1 class="title is-2 has-text-centered">Resultados de la Prueba Técnica</h1>
                
                <div class="columns">
                    <div class="column is-8">
                        <div class="test-info">
                            <h2 class="title is-4">Información de la Prueba</h2>
                            <p><strong>ID de la Prueba:</strong> <span id="test-id">${respuesta.id_prueba}</span></p>
                            <p><strong>Posición:</strong> <span id="test-position">${config.interviewrole}</span></p>
                            <p>
                                <strong>Puntuación global:</strong> ${respuesta.puntaje_final}
                                <span class="icon is-small has-tooltip-multiline" data-tooltip="Puntuación media ponderada en base a todas las entrevistas técnicas realizadas en la empresa">
                                    <i class="fas fa-info-circle" style="color: #3273dc;"></i>
                                </span>
                            </p>
                        </div>
                        <div class="feedback-section">
                    <h2 class="title is-3">Resumen</h2>
                    <div class="feedback-content">
                        <p>
                            <i class="fas fa-user-circle"></i> Estimado ${config.candidato},
                        </p>
                        <p>
                            <i class="fas fa-check-circle"></i> Gracias por completar nuestra prueba técnica para la posición de ${config.interviewType}. Hemos revisado cuidadosamente tus respuestas y nos complace proporcionarte el siguiente feedback:
                        </p>
                        ${
                            htmlstring
                        }
                        <div class="feedback-highlight">
                            <p><strong><i class="fas fa-star"></i> Puntos fuertes:</strong></p>
                            <ul>
                            ${puntos_fuertes.map(el => `<li><i class="fas fa-check"></i> ${el}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="feedback-highlight">
                            <p><strong><i class="fas fa-bullseye"></i> Áreas de mejora:</strong></p>
                            <ul>
                            ${puntos_debiles.map(el => `<li><i class="fas fa-check"></i> ${el}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="feedback-explanation">
                            <p>
                                <i class="fas fa-lightbulb"></i> Queremos enfatizar que identificar áreas de mejora es una parte natural y valiosa del proceso de crecimiento profesional. Cada desarrollador tiene su propio camino de aprendizaje y evolución, y estas áreas representan emocionantes oportunidades para expandir tus habilidades.
                            </p>
                            <p>
                                <i class="fas fa-rocket"></i> La optimización de rendimiento en aplicaciones de gran escala es un desafío constante en nuestro campo, y mejorar en esta área te permitirá crear experiencias de usuario aún más fluidas y eficientes. En cuanto a la seguridad web, es un aspecto crítico que está en constante evolución, y profundizar en este tema fortalecerá significativamente tu perfil como ${config.interviewrole}.
                            </p>
                            <p>
                                <i class="fas fa-graduation-cap"></i> Recuerda que el desarrollo de software es un viaje de aprendizaje continuo. Tus habilidades actuales son impresionantes, y con tu evidente pasión por la tecnología, estamos seguros de que seguirás creciendo y destacando en tu carrera.
                            </p>
                        <p>
                            <i class="fas fa-phone"></i> Nos pondremos en contacto contigo pronto para discutir los siguientes pasos en el proceso de selección. Estamos emocionados por la posibilidad de explorar cómo tu talento y experiencia pueden contribuir al éxito de nuestro equipo en ${config.empresa}.
                        </p>
                        <p>
                            <i class="fas fa-question-circle"></i> Si tienes alguna pregunta o necesitas aclaraciones sobre este feedback, no dudes en contactarnos. Estamos aquí para apoyarte en tu desarrollo profesional.
                        </p>
                        <p>
                            <i class="fas fa-heart"></i> ¡Gracias de nuevo por tu tiempo y dedicación!
                        </p>
                        </div>
                    </div>
                </div>
                    </div>
                    <div class="column is-4">
                        <div class="box company-info">
                            <div class="company-logo">
                            ${config.logo ? <img src="${config.logo}" alt="Logo de Diverger"></img> : ''}
                            </div>
                            <h2 class="title is-4">Información de la Empresa</h2>
                            <p><strong>Nombre:</strong> ${config.empresa}</p>
                            <p><strong>Descripción:</strong> ${mensajes1.mensajes.descripción_empresa}</p>
                            <p><strong>Contacto Recluiter:</strong> <a href="${mensajes1.mensajes.contacto_reclutador}">${mensajes1.mensajes.contacto_reclutador}</a></p>
                            <p><strong>Sitio web:</strong> <a href="${config.web}" target="_blank">${config.web}</a></p>
                        </div>
                        
                        <div class="box next-steps mt-4">
                            <h2 class="title is-4">Siguientes pasos</h2>
                            <div class="is-flex is-align-items-center mb-3">
                                <i class="fas fa-user-circle fa-3x mr-3" style="color: #3273dc;"></i>
                                <div>
                                    <p><strong>${mensajes1.mensajes.reclutador}</strong>, recluiter </p>
                                </div>
                            </div>
                            <p>
                                ${mensajes1.mensajes.siguientes_pasos}
                            </p>
                            <p class="mt-3">
                                <strong>Si tienes alguna duda, puedes contactar a ${mensajes1.mensajes.reclutador}:</strong><br>
                                <i class="fas fa-phone"></i> <a href="tel:${mensajes1.mensajes.reclutador_telefono}">${mensajes1.mensajes.reclutador_telefono}</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="field is-grouped is-grouped-centered mt-6">
                    <div class="control">
                        <button class="button is-large is-primary" id="download">Descargar PDF</button>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <script>
        document.getElementById('download').addEventListener('click', () => {
            const element = document.getElementById('content');

            // Configuración del pdf
            const opt = {
                margin:       1,
                filename:     'mifeedbak.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 }, // aumentar la escala para mejor calidad
                jsPDF:            {unit: 'in', format: 'a3', orientation: 'portrait'}
            };

            html2pdf()
                .from(element)
                .set(opt)
                .save();
        });
    </script>
</body>
</html>
            `
            res.setHeader('Content-Type', 'text/html')
            res.send(html)
        }else{
            res.status(404).json({ error: 'ALGO SALIO MAL' })
        }

        res
    }else{
        res.setHeader('Allow', ['POST', 'GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler