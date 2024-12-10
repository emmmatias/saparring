import connection from "./db";




const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { mail } = req.query
        console.log('mail de req, ', mail)
        try{
            const [rows] = await connection.query('SELECT * FROM empresas WHERE email_admin = ?', [mail])
            if(rows.length > 0){
                console.log('la row de la consulta es:',rows[0])
                
                res.status(200).json({respuesta: rows[0]})
            }if(rows.length == 0){
                
                res.status(404).json({message: 'No hay prueba para ese id'})
            }
        }catch(error){
            console.log(error)
        }
    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler