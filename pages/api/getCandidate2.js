import connection from "./db";
import jwt, { decode } from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET

const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { candidato, token } = req.query
        
        try{
            let decoded = jwt.verify(token, SECRET_KEY)
            const [rows] = await connection.query('SELECT * FROM candidatos WHERE mail = ?', [candidato])
            if(rows.length > 0){
                console.log('las rows de la consulta son:', rows)
                res.status(200).json(rows[0])
            }if(rows.length == 0){
                res.status(404).json({message: 'No hay prueba para ese id'})
            }
        }catch(error){
            console.log(error)
            return res.status(403).json({ message: 'TOKEN INVÁLIDO' })  
        }

    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler