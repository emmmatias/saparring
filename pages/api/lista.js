import connection from "./db";


const handler = async (req, res) => {
    if(req.method == 'GET'){
        if(req.query.mail){
            const { mail } = req.query
        try{
            const [rows] = await connection.query('SELECT * FROM pruebas WHERE mail = ?', [mail])
            if(rows.length > 0){
                console.log('las rows de la consulta son:',rows)
                res.status(200).json({pruebas: rows})
            }if(rows.length == 0){
                res.status(404).json({message: 'No hay prueba para este usuario'})
            }
        }catch(error){
            res.status(500).json({message: 'Error al conectar con la base de datos'})
        }
        }
        if(req.query.id){
            const { id } = req.query
            try{
                const [rows] = await connection.query('SELECT preguntas FROM pruebas WHERE id = ?', [id])
                if(rows.length > 0){
                    console.log('las rows de la consulta son:',rows)
                    console.log(rows[0])
                    res.status(200).json({pruebas: rows[0].preguntas})
                }if(rows.length == 0){
                    res.status(404).json({message: 'No hay detalle para este usuario'})
                }
            }catch(error){
                res.status(500).json({message: 'Error al conectar con la base de datos'})
            }
        }

    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler