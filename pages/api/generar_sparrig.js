// la ruta debe corroborar credenciales desde las cabeceras
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import connection from "./db";
import crypto from 'crypto'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  function generarIdUnico() {
    const fecha = new Date();
    const tiempo = fecha.getTime().toString(36).substr(0, 10); // 10 caracteres
    const aleatorio = Math.floor(Math.random() * 1000000).toString(36).substr(0, 6); // 6 caracteres
    const hash = crypto.randomBytes(4).toString('hex').substr(0, 4); // 4 caracteres
    const idUnico = `${tiempo}${aleatorio}${hash}`;
  
    return idUnico;
  }

  function eliminarTextosEncerrados(texto) {
    return texto.replace(/@[^@]+@/g, '');
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

  const SECRET_KEY = process.env.JWT_SECRET
  let BaseUrl = process.env.BASE_URL

  const notificar_prueba_generada = (recluiter, user, id, tecnologias, categoria, time, dificulti) => {
    //luego agregar query para estados

    let html = 
    `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva prueba técnica creada en Sparring ${id}</title>
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
        .tag {
            display: inline-block;
            background-color: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            margin: 2px;
            font-size: 0.9em;
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
            <h1>Nueva prueba técnica creada en Sparring ${id}</h1>
            
            <p>Se ha creado exitosamente una nueva prueba técnica en Sparring. Aquí tienes los detalles:</p>
            
            <table class="details-table">
                <tr>
                    <td>ID de la prueba</td>
                    <td>${id}</td>
                </tr>
                <tr>
                    <td>URL de la prueba</td>
                    <td><a href="${BaseUrl}/prueba/${id}" class="highlight">${BaseUrl}/prueba/${id}</a></td>
                </tr>
                <tr>
                    <td>Tecnologías</td>
                    <td>
                        ${tecnologias}
                    </td>
                </tr>
                <tr>
                    <td>Dificultad</td>
                    <td>${dificulti}</td>
                </tr>
                <tr>
                    <td>Tiempo asignado</td>
                    <td>${time} minutos</td>
                </tr>
                <tr>
                    <td>Creado por</td>
                    <td>${recluiter}</td>
                </tr>
                <tr>
                    <td>Fecha de creación</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            </table>
            
            <div style="text-align: center;">
                <a href="${BaseUrl}/prueba/${id}" style="color: white;" class="button">Ver prueba</a>
            </div>
            
            <p>Asegúrate antes de compartir el enlace de la prueba con los candidatos desde tu panel de control.</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Wuilders Labs - Sparring.dev</p>
            <p>Este correo fue enviado a ${user}</p>
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
      to: user, 
      subject: '¡Nueva evaluación generada!',
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

const generar_preguntas = async (interviewType, selectedTechnologies, interviewLevel, interviewdificultyLevel, categoria, time) => {
    let arr = []
    let prompt
    let tipo = categoria.name
    if(categoria.name == 'Pruebas Tipo Test'){

        prompt = `
        Genera una pregunta **${interviewdificultyLevel}**, específica sobre **${interviewType}** para un nivel **${interviewLevel}** que evalúe cualquiera de las siguientes tecnologías: **${selectedTechnologies}**.
    - Proporciona al menos **4 opciones de respuesta**, de las cuales ** 1 deben ser correctas**.
    - Encierra cada opción de respuesta entre los símbolos **@**, en el formato: **@ opción de respuesta @**.
    - Asegúrate de que cada opción tenga los símbolos de apertura y cierre.
    
    - **No incluyas respuestas ambiguas o que puedan tener múltiples interpretaciones.**
        `
      /*
        prompt = `Genera una pregunta ${interviewdificultyLevel}, específica sobre ${interviewType} para un nivel ${interviewLevel} que evalue cualquiera de las siguientes tecnologías ${selectedTechnologies}, 
        dame cuatro (no menos) opciones para responder con una sola opción correcta, encierra cada opción para responder entre simbolos @ cada opcion debe tener el siguente formato @  opcion para responder  @ (respeta los espacios) asgurate de que cada opcion tenga @ de apertura y otro de cierre`
        console.log('------', prompt)*/

        for (let i = 0; i < categoria.numero; i++) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            console.log('++++++++++++++++++++++ pregunta:', response)
            let pregunta = eliminarTextosEncerrados(response);
            let opciones = extraerTextos(response);
            opciones = opciones ? opciones.map(e => e.slice(0)) : [];
            arr.push({pregunta, opciones, tipo})   
        }
    }
    if(categoria.name == 'Preguntas a Desarrollar'){

      prompt = `
      Genera una pregunta **${interviewdificultyLevel}** a desarrollar, específica sobre **${interviewType}** para un nivel **${interviewLevel}** que se pueda desarrollar en ** ${time} minutos ** y que evalúe las siguientes tecnologías: ** ${selectedTechnologies}**.
    - Incluye **detalles adicionales** para guiar al entrevistado sobre los aspectos específicos que debería abordar en su respuesta.
    - Proporciona también **ejemplos de posibles enfoques**, pero **NO soluciones** ya que es una prueba de examen.
    - **No incluyas respuestas vagas o generales, enfócate en detalles específicos que se deben desarrollar**.
      `

        /*prompt = `Genera una pregunta ${interviewdificultyLevel} a desarrollar, específica sobre ${interviewType} para un nivel ${interviewLevel} que evalue cualquiera de las siguientes tecnologías ${selectedTechnologies}`*/
        console.log('------', prompt)
        for (let i = 0; i < categoria.numero; i++) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            arr.push({pregunta: response, tipo})
        }
    }
    if(categoria.name == 'Evaluación de Complejidad Algorítmica'){
        prompt = `
        Escribe un problema de **complejidad algorítmica** sobre cualquiera de las siguientes tecnologías: ** ${selectedTechnologies}**, para una entrevista laboral de ** ${interviewType}**, con una dificultad ** ${interviewdificultyLevel}** y un nivel ** ${interviewLevel}**, que se pueda contestar en ** ${time} minutos**.
    - Encierra toda la consigna entre los símbolos **@**, por ejemplo: **@ Escribe un código para ordenar de mayor a menor todos los números de una array @**.
    - Asegúrate de especificar los **requisitos de tiempo y espacio**, y proporciona una **breve descripción del contexto**, pero nunca la solución, en el que este problema debe ser relevante en **proyectos de desarrollo tecnológico**.
        `
        //prompt = ` Escribe un problema de complejidad algorítmica (solo el problema) sobre lo que desees para evaluar cualquiera de las siguientes tecnologias ${selectedTechnologies} para una entrevista laboral para un ${interviewType} con una dificultad ${interviewdificultyLevel} y de un nivel ${interviewLevel} importante: encierra toda la consigna entre simbolos @ ejemplo: @ Escribe un codigo para ordenar de mayor a menor todos los numeros de una array @`
        console.log('------', prompt)
        for(let i = 0; i < categoria.numero; i++){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            arr.push({pregunta: extraerTextos(response)[0], tipo})
        }
    }
    if(categoria.name == 'Desarrollo de Código'){

      prompt = `
      Genera un problema que requiera el desarrollo de un código de dificultad **${interviewdificultyLevel}**, sobre **${interviewType}**, para un nivel **${interviewLevel}**, que evalúe cualquiera de las siguientes tecnologías: **${selectedTechnologies}** en un **${time} minutos**. **SOLO PROPORCIONA LA CONSIGNA**.
    - Incluye **restricciones claras** que el entrevistado debe tener en cuenta (por ejemplo, limitaciones de tiempo de ejecución, memoria, o el uso de estructuras de datos específicas).
    - Añade un **ejemplo simple de entrada y salida esperada** para clarificar los requisitos del problema, **pero nunca una solución a la misma, solo un ejemplo**.
    - **No aceptes respuestas sin restricciones claras o ejemplos de entrada y salida**.
      `
        
        //prompt = `Pideme generar un código ${interviewdificultyLevel}, sobre ${interviewType} para un nivel ${interviewLevel} que evalue cualquiera de las siguientes tecnologías ${selectedTechnologies}. SOLO DAME LA CONSIGNA NO ME DIGAS NADA MAS`
        console.log('------', prompt)
        for(let i = 0; i < categoria.numero; i++){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            arr.push({pregunta: response, tipo})
        }
    }
    if(categoria.name == 'Corrección de Errores'){

      prompt = `
      Genera un fragmento de código de dificultad **${interviewdificultyLevel}**, sobre **${interviewType}**, para un nivel **${interviewLevel}**, que evalúe cualquiera de las siguientes tecnologías: **${selectedTechnologies}** en un **${time} minutos**, que cumpla con el siguiente propósito (añadir comentario de propósito al inicio del código).
    - Incluye varios **errores intencionales** que no sean inmediatamente obvios, pero detectables para alguien con experiencia.
    - Asegúrate de que los errores estén relacionados con la **lógica de cálculo o el manejo de excepciones**, y que solo puedan ser resueltos por alguien con nivel **{interview_level}**.
    - **SOLO GENERA EL FRAGMENTO DE CÓDIGO**.
    - Proporciona un breve comentario al final que describa el tipo de error introducido (sin especificar el error exacto) para orientar al evaluador sobre el tipo de análisis que se espera del candidato.
    - **No incluyas errores sintácticos triviales, deben ser errores lógicos sutiles**.
      `

        /*prompt = `Necesito que generes un fragmento de código en cualquiera de las siguientes tecnologias: ${selectedTechnologies}. que cumpla con el siguiente propósito: añade un comentario de lo que deberia hacer el codigo Incluir un error intencional que no sea inmediatamente obvio, pero que pueda ser detectado por alguien con experiencia revisando o ejecutando el código
        Asegúrate de que el error esté relacionado con la lógica de cálculo o el manejo de excepciones NO ACLARES CUAL ES EL ERROR. La dificultad debe ser ${interviewdificultyLevel} para ser resuelto por una persona con una experiencia ${interviewLevel} y un perfil ${interviewType}. SOLO GENERA EL FRAGMENOTO NO ME DES INTRODUCCION O ALGO DE MÁS
        `*/
        
        console.log('------', prompt)
        for(let i = 0; i < categoria.numero; i++){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            arr.push({pregunta: response, tipo})
        }
    }
    if(categoria.name == 'Completar Código'){

      prompt = `
      Genera un fragmento de código incompleto en cualquiera de las siguientes tecnologías: **${selectedTechnologies}**, para una entrevista laboral.
    - Añade un **comentario al inicio** sobre cuál es la finalidad del código.
    - La evaluación es para una persona con nivel de experiencia **${interviewLevel}** y perfil **${interviewType}**.
    - La dificultad debe ser **${interviewdificultyLevel}** en un **${time} minutos**.
    - **SOLO PROPORCIONA EL FRAGMENTO DE CÓDIGO**.
    - Asegúrate de que el código tenga al menos **dos secciones faltantes críticas** para su funcionamiento completo, y proporciona comentarios que indiquen lo que falta por implementar.
    - **No generes fragmentos que sean demasiado simples o que no requieran un análisis profundo para completar**.
      `

        //prompt = `genera un fragmento de código incompleto para evaluar cualquiera de las siguientes tecnologías: ${selectedTechnologies}. En una entrevista lavoral. añade un comentario al inicio de cual es la finalidad del codigo. se evalua a una persona con una experiencia ${interviewLevel} y un perfil ${interviewType} la dificultad debe ser ${interviewdificultyLevel}. SOLO DAME EL FRAGMENTO DE CÓDIGO.`
        console.log('------', prompt)
        for(let i = 0; i < categoria.numero; i++){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Eres un entrevistador experto en selección TI con formación en ${interviewType}. ${prompt} `
                }],
                max_tokens: 1000,
              });
            let response = completion.choices[0].message.content
            console.log('añadiendo una pregunta a completar codigo', response)
            arr.push({pregunta: response, tipo})
        }
    }
    
    return arr
}

const handler = async (req, res) => {
    if(req.method === 'POST'){
        let config = JSON.parse(req.body)
        let { 
            interviewType,
            user,
            recluiter,
            emailCandidato,
            selectedTechnologies,
            interviewLevel,
            interviewdificultyLevel,
            time,
            Preguntas
          } = config
        let mail = user
        
        const [rows] = await connection.query('SELECT logo, contraseña, web from empresas WHERE email_admin = ?', [user])
        
        if(rows.length > 0){
          const data = rows[0]
          let array_mensajes_de_reclutadores = JSON.parse(data.contraseña).mensajes
          console.log('el recluiter es:', recluiter)
          let mensajes_de_reclutador = array_mensajes_de_reclutadores.filter(obj => {return(obj.reclutador_email == recluiter)})[0]
          console.log(mensajes_de_reclutador)
          let aa = mensajes_de_reclutador.mensajes
          config['logo'] = data.logo
          config['contraseña'] = {mensajes: {...aa}}
          config['web'] = data.web
        }

        console.log('el usuario es: ', user)
        console.log('DENTRO DEL GENERAR SPARRING', config)

        let preguntas_generadas = []
          let id = generarIdUnico()
        for (const categoria of Preguntas){
            let generadas = await generar_preguntas(interviewType, selectedTechnologies, interviewLevel, interviewdificultyLevel, categoria, time)
            preguntas_generadas.push(...generadas)  
        }

        try{

          connection.query(`CREATE TABLE IF NOT EXISTS pruebas (
            id VARCHAR(20),
            mail VARCHAR(255),
            config LONGTEXT,
            preguntas LONGTEXT,
            abierta BOOLEAN DEFAULT TRUE
            )`)
          let [resultados] = await connection.query(`SELECT * from candidatos where mail = ?`, [emailCandidato])
          console.log('resulatados:', [resultados])
          if(resultados.length > 0){
            console.log('YA EXISTE EL USUARIO')
            let datos_candidato = resultados[0]
            console.log('DATA DEL CANDIDATO = ', resultados[0] )
            connection.query(`INSERT INTO pruebas (id, mail, config, preguntas, abierta) VALUES (?, ?, ?, ?, ?)`, [id, mail, `${JSON.stringify(config)}`, `${JSON.stringify({preguntas_generadas})}`, 1])
            notificar_prueba_generada(recluiter, user, id, config.selectedTechnologies.join(','), config.interviewType, config.time, config.interviewdificultyLevel)         
            return res.status(200).json({id, preguntas_generadas, data_candidato: datos_candidato})
          }
          if(!resultados.length > 0){
            console.log('NO EXISTE EL USUARIO ANTERIORMENTE')
            connection.query(`INSERT INTO pruebas (id, mail, config, preguntas, abierta) VALUES (?, ?, ?, ?, ?)`, [id, mail, `${JSON.stringify(config)}`, `${JSON.stringify({preguntas_generadas})}`, 1])
            notificar_prueba_generada(recluiter, user, id, config.selectedTechnologies.join(','), config.interviewType, config.time, config.interviewdificultyLevel)
            return res.status(200).json({id, preguntas_generadas})
          }
        }catch(err){
          console.error(err)
          return res.status(500).json({message: "error al insertar datos"})
        }


    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler