import connection from "./db";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


const handler = async (req, res) => {
    if(req.method == 'POST'){
        const data_post = JSON.parse(req.body)

        const {data, id_respuesta} = data_post

        const [result] = await connection.query('UPDATE respuestas SET feedbacks = ? WHERE id_respuesta = ?', [ `${data}` , id_respuesta])
        if(result.affectedRows > 0){
            res.status(200).json({ message: 'Registro actualizado' });
        }
        if(result.affectedRows <= 0){
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler