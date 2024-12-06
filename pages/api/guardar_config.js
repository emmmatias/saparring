import connection from "./db";

const handler = async (req, res) => {
    if(req.method == 'POST'){

        let data = JSON.parse(req.body)
        let { mail, mensajes, reclutador} = data
        const  [rows] = await connection.query('SELECT contraseña from empresas where email_admin = ?', [mail])
        if(rows.length > 0){
          console.log(mensajes)
          let mensajes_previos = JSON.parse(rows[0].contraseña).mensajes
          console.log(mensajes_previos)
          console.log('reclutador: ', reclutador)
          let nuevos_mensajes = []
          mensajes_previos.forEach((obj, index) => {
            let obj2 = {
              ...obj
            }
            if(obj.reclutador_email == reclutador){
              obj2.mensajes = mensajes.mensajes
              nuevos_mensajes.push(obj2)
            }
            if(obj.reclutador_email != reclutador){
              nuevos_mensajes.push(obj2)
            }
          })
          console.log(nuevos_mensajes)
          const [result] = await connection.query('UPDATE empresas SET contraseña = ? WHERE email_admin = ?', [JSON.stringify({mensajes: nuevos_mensajes}), mail])
        if (result.affectedRows > 0) {
            console.log(result)
            res.status(200).json({ message: 'Registro actualizado' });
          } else {
            res.status(404).json({ message: 'Registro no encontrado' });
          } 
        }
          
    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler