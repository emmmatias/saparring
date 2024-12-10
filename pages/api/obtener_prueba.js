import connection from "./db";


const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { id } = req.query
        console.log('++++++++++++++ el id recibido es : ', id)
        try{
            const [rows] = await connection.query('SELECT * FROM pruebas WHERE id = ?', [id])
            if(rows.length > 0){
                console.log('las rows de la consulta son:', rows)
                res.status(200).json({respuesta: rows[0]})
            }if(rows.length == 0){
                res.status(404).json({message: 'No hay prueba para ese id'})
            }
        }catch(error){
            console.error(error)
        }
    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler