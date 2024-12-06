import connection from "./db";
import OpenAI from 'openai';
import jwt, { decode } from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SECRET_KEY = process.env.JWT_SECRET
let BaseUrl = process.env.BASE_URL

//notificaciones mails examentes
const notificar_recluiter = (mail_recluiter, prueba_id, mail_candidato, inicio) => {
  let html = 
  `
  <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba técnica completada por candidato - Sparring</title>
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
        .candidate-info {
            background-color: #485fc7;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .candidate-info h2 {
            margin: 0;
            color: white;
        }
        .candidate-info p {
            margin: 5px 0 0 0;
            opacity: 0.9;
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
            <h1>Nueva prueba completada - ${prueba_id}</h1>
            
            <div class="candidate-info">
                <p>${mail_candidato}</p>
            </div>
            
            <table class="details-table">
                <tr>
                    <td>ID de la prueba</td>
                    <td>${prueba_id}</td>
                </tr>
                <tr>
                    <td>Fecha de inicio</td>
                    <td>${new Date(inicio).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td>Fecha de entrega</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            </table>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/dash_empresa" style="color: #ffffff;" class="button">Ver resultados y feedback</a>
            </div>

            <p>Puedes acceder a la plataforma para:</p>
            <ul>
                <li>Revisar el código del candidato</li>
                <li>Ver el análisis automático de la prueba</li>
                <li>Añadir tus comentarios y valoración</li>
                <li>Generar el informe de la prueba</li>
            </ul>
            
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            
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
    to: mail_recluiter, 
    subject: '¡Nueva evaluación terminada!',
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

const notificar_candidato = (prueba_id, mail_candidato) => {

    const token = jwt.sign({ mail_candidato }, SECRET_KEY, { expiresIn: '4h' })

  let html = 
  `
  <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba técnica completada en Sparring</title>
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
            <h1>¡Prueba técnica completada!</h1>
            
            <p>Gracias por completar tu prueba técnica en Sparring. Aquí tienes los detalles de tu prueba:</p>
            
            <table class="details-table">
                <tr>
                    <td>ID de la prueba</td>
                    <td>${prueba_id}</td>
                </tr>
                <tr>
                    <td>Fecha de finalización</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            </table>

            <div class="info-box">
                <strong>📋 Próximos pasos:</strong>
                <ol>
                    <li>Recibirás feedback detallado de tu prueba en las próximas 48 horas</li>
                    <li>Mientras tanto, te invitamos a completar tu perfil tecnológico:</li>
                </ol>
            </div>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/dash_user2?token=${token}&page=config&candidato=${mail_candidato}" style="color: #ffffff;" class="button">Completar mi perfil técnico</a>
            </div>

            <p>En tu perfil podrás:</p>
            <ul>
                <li>Indicar tus tecnologías favoritas</li>
                <li>Establecer tu nivel de experiencia en cada una</li>
                <li>Destacar tus áreas de especialización</li>
            </ul>
            
            <p>Esto nos ayudará a proporcionarte mejores oportunidades y pruebas más relevantes en el futuro.</p>
            
            <p>¡Gracias por confiar en Sparring!</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${mail_candidato}</p>
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
    to: mail_candidato, 
    subject: '¡FElicitaciones por terminar tu evaluación!',
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

function eliminarTextosEntreEtiquetas4(texto) {
    const regex = /<puntodebil>(.*?)<\puntodebil>/g;
    let texto1 =  texto.replace(regex, '');
    const regex1 = /<puntofuerte(.*?)<\puntofuerte>/g;
    let texto2 =  texto1.replace(regex1, '');
    const regex2 = /<comentario>(.*?)<\comentario>/g;
    let texto3 = texto2.replace(regex2, '');
    return texto3
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

  function extraerTextosEntreEtiquetas(texto) {
    // Expresión regular para encontrar textos entre <puntodebil>
    const regex = /<punto debil>(.*?)<\punto debil>/g;
    const resultados = [];
    let match;

    // Ejecutar la búsqueda en un bucle hasta que no haya más coincidencias
    while ((match = regex.exec(texto)) !== null) {
        // Agregar el texto encontrado al array
        resultados.push(match[1]); // match[1] contiene el texto entre las etiquetas
    }

    return resultados;
}

function extraerTextosEntreEtiquetas2(texto) {
    // Expresión regular para encontrar textos entre <puntodebil>
    const regex = /<punto fuerte>(.*?)<\punto fuerte>/g;
    const resultados = [];
    let match;

    // Ejecutar la búsqueda en un bucle hasta que no haya más coincidencias
    while ((match = regex.exec(texto)) !== null) {
        // Agregar el texto encontrado al array
        resultados.push(match[1]); // match[1] contiene el texto entre las etiquetas
    }

    return resultados;
}

function extraerTextosEntreEtiquetas3(texto) {
    // Expresión regular para encontrar textos entre <puntodebil>
    const regex = /<comentario>(.*?)<\comentario>/g;
    const resultados = [];
    let match;

    // Ejecutar la búsqueda en un bucle hasta que no haya más coincidencias
    while ((match = regex.exec(texto)) !== null) {
        // Agregar el texto encontrado al array
        resultados.push(match[1]); // match[1] contiene el texto entre las etiquetas
    }

    return resultados;
}

const handler = async (req, res) => {
    if(req.method == 'POST'){
        const data = JSON.parse(req.body)
        const {mail_recluiter, prueba_id, preguntas , max_preguntas, tecnologies, mail_candidato, interviewType, level, termino} = data
        console.log('mail reclutador', mail_recluiter)
        //leer las respuestas guardadas
        let puntajes = [] //almacenará los puntajes de cada pregunta
        let feedbacks = []
        let puntosfuertes = []
        let puntosdebiles = []
        let comentarioinspiracional
        let comentario
        let comentariosobrerespuestas = []
        let respuestas
        const [rows] = await connection.query('SELECT * FROM respuestas where id_respuesta = ?', [`${prueba_id}${mail_candidato}`])
        // verificar si existen las respuestas
        if(rows.length > 0){
            let respuesta = rows[0]
            //necesitamos emparejar pregunta con array
            //console.log(respuesta)
            //console.log('verificando si puedo ver que el inicio sea una fecha valida:', respuesta.inicio instanceof Date)
            //console.log('verificando si puedo ver que el termino sea una fecha valida:', new Date(respuesta.termino) )
            //console.log('EL TERMINO ES ', respuesta.termino , 'tipo:', respuesta.termino == false)
            const inicio = new Date(respuesta.inicio)
            const fecha = new Date(respuesta.termino)
            if(isNaN(fecha.getTime())){
                respuestas = extraerTextos(rows[0].respuestas)
                ////////////////////////////////////
                //respuestas[''] -> arr: [{pregunta: , respuesta:}]
                //
            console.log('Respuestas!!! :', respuestas)
            console.log('Preguntas!!! :', preguntas)
           
            let preg_respuestas = preguntas.map((obj, index) => {
                return(
                    {
                        ...obj,
                        respuesta: respuestas[index]
                    }
                )
            })
            
            for(let pre_res of preg_respuestas){
                if(pre_res.tipo == 'Pruebas Tipo Test'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${mail_candidato} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                          Teniendo en cuenta que la pregunta es: ${pre_res.pregunta}  
                          Teniendo en cuenta las opciones posibles solo son : ${pre_res.opciones}.
                        - Debuelve un puntaje 0 o 100 con el formato: Puntuación: X donde X es 0 o 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
                if(pre_res.tipo == 'Preguntas a Desarrollar'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${mail_candidato} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                        - Debuelve un puntaje entre 0 a 100 con el formato: Puntuación: X donde X es un valor entre 0 y 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Pregunta: ${pre_res.pregunta} , Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
                if(pre_res.tipo == 'Evaluación de Complejidad Algorítmica'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${mail_candidato} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                        Si la respuesta es Demuestra un edsconocimiento del tema o no responde la pregunta el puntaje debe ser 0
                          - Debuelve un puntaje entre 0 a 100 con el formato: Puntuación: X donde X es un numero entre 0 o 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Pregunta: ${pre_res.pregunta} , Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
                if(pre_res.tipo == 'Desarrollo de Código'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para una consigna dada a ${mail_candidato}. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                            Si la respuesta es Demuestra un edsconocimiento del tema o no responde la pregunta el puntaje debe ser 0
                          - Debuelve un puntaje entre 0 a 100 con el formato: Puntuación: X donde X es un numero entre 0 o 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Consigna: ${pre_res.pregunta} , Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
                if(pre_res.tipo == 'Corrección de Errores'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${mail_candidato} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                        Si la respuesta es Demuestra un edsconocimiento del tema o no responde la pregunta el puntaje debe ser 0
                          - Debuelve un puntaje entre 0 a 100 con el formato: Puntuación: X donde X es un numero entre 0 o 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Pregunta: ${pre_res.pregunta} , Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
                if(pre_res.tipo == 'Completar Código'){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para un codigo dado por un usuario ${mail_candidato} tratando de resolver una consigna dada. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                        evalua si el código dado respoinde o no a la consoigan de forma satisfactoria
                        Si la respuesta es Demuestra un edsconocimiento del tema o no responde la pregunta el puntaje debe ser 0
                        - Debuelve un puntaje entre 0 a 100 con el formato: Puntuación: X donde X es un numero entre 0 o 100. (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        - Identifica Fortalezas y Áreas de Mejora en cuanto a lo que el usuario ingrese como respuesta:
                        - Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <punto fuerte> (punto fuerte identificado) <punto fuerte> , recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <punto debil> (punto debil identificado) <punto debil> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario> recuerda encerrar el punto entre las etiquetas seleccionadas.
                        - añade sugerencias con el formato <sugerencia> sugerencia <sugerencia>, envuelve la sugerencia entre etiquetas <sugerencia>
                        `
                        },
                        {
                          role: "user",
                          content: `Pregunta: ${pre_res.pregunta} , Respuesta: ${pre_res.respuesta}`
                        }],
                        max_tokens: 500,
                    })
                    const feedbackContent = completion.choices[0].message.content.trim()
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
            }
            console.log('PUNTAJES', puntajes)
            const suma = puntajes.reduce((acumulador, valorActual) => acumulador + valorActual, 0)
            const promedio = parseInt(suma / puntajes.length)
            const [result] = await connection.query('UPDATE respuestas SET feedbacks = ?, puntaje_final = ?, termino = ? WHERE id_respuesta = ?', [feedbacks.join('@ @'), ((promedio >= 0) ? promedio : 0), new Date(),`${prueba_id}${mail_candidato}`])
            /*
            for(let respuesta of respuestas){
                ////////////////////////
                console.log('Respuesta!!! :', respuesta)
                
                for(let preg of preguntas){
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{
                          role: "system",
                          content: `Eres un CTO experto en entrevistas técnicas para ${interviewType}. Tu tarea es proporcionar un feedback detallado y una puntuación precisa para la respuesta de ${mail_candidato} a la siguiente pregunta. El nivel esperado del candidato es ${level}. Las tecnologías evaluadas son: ${tecnologies.join(', ')}.
                         Instrucciones para Evaluación de Respuestas:
                        Proporciona Feedback: Ofrece comentarios constructivos y empáticos.
                        Identifica Fortalezas y Áreas de Mejora:
                        Puntos Fuertes: Identifica y describe tres puntos fuertes de la respuesta, utilizando el formato: <puntofuerte> (punto fuerte identificado) <puntofuerte>.
                        asegurate de encerrar cada punto fuerte entre etiquetas <puntofuerte>
                        Puntos Débiles: Señala y explica tres puntos débiles, usando el formato: <puntodebil> (punto debil identificado) <puntodebil>.
                        asegurate de encerrar cada punto debil entre etiquetas <puntodebil>
                        Ofrece Sugerencias: Proporciona recomendaciones concretas para mejorar la respuesta o profundizar en el tema.
                        Asignación de Puntuación: Evalúa la calidad y precisión de la respuesta con una puntuación del 0 al 100. Especifica la puntuación al final del feedback en el formato: Puntuación: X donde X es el numero (No agregues ningún caracter extra al devolver la puntuacion ya que se utiliza para evaluar regex)
                        Si la respuesta es "No lo sé" o similar, la puntuación debe ser 0.
                        Comentario General: Incluye un comentario general sobre la respuesta utilizando el formato: <comentario> comentario <comentario>.
                        Sé justo y preciso en tu evaluación.`
                            
                        },
                        {
                          role: "user",
                          content: `Pregunta: ${preg}\n\nRespuesta: ${respuesta}`
                        }],
                        max_tokens: 500,
                    });
                    
                    const feedbackContent = completion.choices[0].message.content.trim()
                    console.log(feedbackContent)
                    console.log('la respuesta fue:', respuesta)
                    const scoreMatch = feedbackContent.match(/Puntuación:\s*(\d+)/)
                    let cc = extraerTextosEntreEtiquetas3(feedbackContent)
                    comentariosobrerespuestas.push(cc)
                    puntosdebiles = extraerTextosEntreEtiquetas(feedbackContent)
                    puntosfuertes = extraerTextosEntreEtiquetas2(feedbackContent)
                    feedbacks.push(eliminarTextosEntreEtiquetas4(feedbackContent))
                    console.log('el scorematch: ', feedbackContent.match(/Puntuación:\s*(\d+)/))
                    let puntaje = scoreMatch ? parseInt(scoreMatch[1], 10) : 50
                    puntajes.push(puntaje)
                }
            }*/
            //console.log('PUNTAJES', puntajes)
            //const suma = puntajes.reduce((acumulador, valorActual) => acumulador + valorActual, 0)
            //console.log('suma', suma)
            //const promedio = parseInt(suma / puntajes.length)
            //console.log('promedio', promedio)
            //const [result] = await connection.query('UPDATE respuestas SET feedbacks = ?, puntaje_final = ?, termino = ? WHERE id_respuesta = ?', [feedbacks.join('@ @'), ((promedio >= 0) ? promedio : 0), new Date(),`${prueba_id}${mail_candidato}`])
            //res.status(200).json({ feedbacks, puntajes, puntuación : promedio, puntosdebiles, puntosfuertes })
            
            notificar_candidato(prueba_id, mail_candidato)
            
            notificar_recluiter(mail_recluiter, prueba_id, mail_candidato, inicio)

            res.status(200).json({ feedbacks, puntajes, puntuación : promedio, puntosdebiles, puntosfuertes })
          }
            if(!isNaN(fecha.getTime())){
              notificar_candidato(prueba_id, mail_candidato)
            
              notificar_recluiter(mail_recluiter, prueba_id, mail_candidato, inicio)

                res.status(402).json({ message: 'Test ya finalizado' })
            }
        }

    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler