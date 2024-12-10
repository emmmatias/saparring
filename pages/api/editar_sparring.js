import OpenAI from 'openai';
import connection from "./db";

const handler = async (req, res) => {
    if(req.method === 'POST'){
        let config = JSON.parse(req.body)
        const { 
            id,
            preguntas_generadas
          } = config
        
          try{
            let [result] = await connection.query('UPDATE pruebas SET preguntas = ? WHERE id = ?', [JSON.stringify({preguntas_generadas}), id])
            if(result.affectedRows > 0){
                
                res.status(200).json({message: 'Operacion exitosa'})
            }else{
                
                res.status(401).json({message: 'Error al actualizar'})
            }
        }catch(error){
            console.error(error)
            
            res.status(401).json({message: error})
          }


    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler