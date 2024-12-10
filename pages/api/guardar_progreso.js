import connection from "./db";

const handler = async (req, res) => {
    if(req.method == 'POST'){
        const data_post = JSON.parse(req.body);
        const {respuestas, prueba_id, mail_candidato} = data_post
        // respuestas [e,e,e,e,e]
        let respeustas_str = respuestas.join('@ @')
        console.log('respuestas parseadas : ', respeustas_str)
        try{
        const [result] = await connection.query('UPDATE respuestas SET respuestas = ? WHERE id_respuesta = ?', [ `@${respeustas_str}@` ,`${prueba_id}${mail_candidato}`])
        if (result.affectedRows > 0) {
            console.log(result)
            res.status(200).json({ message: 'Registro actualizado' });
          } else {
            res.status(404).json({ message: 'Registro no encontrado' });
          }
        }catch(error){
            console.error(error)
        }
    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler