import OpenAI from 'openai'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })


const handler = async (req, res) => {
    if(req.method == 'POST'){
        const data_post = JSON.parse(req.body)
        
        let {
            tipo,
            recluiter,
            descripción_empresa,
            descripción_prueba,
            mensaje_personal
        } = data_post

        try{
        if(tipo == 'descripcion'){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Trabajas en marketing, quiero que crees una descripción de 200 a 300 palabras (NO más) atractiva para una empresa, esta es la actual:
                  ${descripción_empresa}, no la incluyas en tu respuesta es para que sepas acerca de la empresa. `
                }],
                max_tokens: 500,
              });
            
            let response = completion.choices[0].message.content
            
            return res.status(200).json({data: response, tipo_des: tipo})

        }
        if(tipo == 'descripcion prueba'){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Trabajas en marketing, quiero que crees una descripción de prueba de 200 a 300 palabras (NO más) atractiva para un examen técnico, esta es la actual:
                  ${descripción_prueba}`
                }],
                max_tokens: 500,
              });
            
            let response = completion.choices[0].message.content
            
            return res.status(200).json({data: response, tipo_des: tipo})
        }
        if(tipo == 'mensaje personal'){
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                  role: "system",
                  content: `Trabajas en marketing, quiero que crees un mensaje corto amigable, pero formal para incluir en una prueba  para una candidato al estipo de: 
                  ${mensaje_personal} mi nombre es ${recluiter}`
                }],
                max_tokens: 200,
              });
            
            let response = completion.choices[0].message.content
            
            return res.status(200).json({data: response, tipo_des: tipo})
        }
        }catch(error){
            return res.status(500).json({message: "Error"})
        }

    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler