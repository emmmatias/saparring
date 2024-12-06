import connection from "./db";


const handler = async (req, res) => {
    if(req.method == 'GET'){

        const { mail } = req.query

        const [rows] = await connection.query('SELECT * FROM candidatos WHERE mail = ?', [mail])
        if(rows.length > 0){
            console.log('las rows de la consulta son:', rows)
            res.status(200).json(rows[0])
        }if(rows.length == 0){
            res.status(404).json({message: 'No hay prueba para ese id'})
        }

    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler