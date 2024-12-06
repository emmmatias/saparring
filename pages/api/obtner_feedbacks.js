import connection from "./db"


const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { empresa } = req.query

        let [rows] = await connection.query('SELECT respuestas.*, pruebas.config FROM respuestas JOIN pruebas ON respuestas.id_prueba = pruebas.id WHERE pruebas.mail = ?', [empresa])
        
        if(rows.length > 0){
            res.status(200).json({feedbacks: rows})
        }else{
            res.status(404).json({message: 'No hay respuestas todavía'})
        }
    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler