import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;

function generarIdUnico() {
    const fecha = new Date();
    const tiempo = fecha.getTime().toString(36).substr(0, 10); // 10 caracteres
    const aleatorio = Math.floor(Math.random() * 1000000).toString(36).substr(0, 6); // 6 caracteres
    const hash = crypto.randomBytes(4).toString('hex').substr(0, 4); // 4 caracteres
    const idUnico = `${tiempo}${aleatorio}${hash}`;
  
    return idUnico;
  }

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const data_post = JSON.parse(req.body);
        const {mail_candidato, id_prueba, config} = data_post
        console.log('++++++++++++++++++++++++ el obj recibido es:',data_post)
        //corroboramos que no haya una sesión previa para ese sparring
        //obtenemos mail_candidato, id_prueba, inicio_prueba, id_sesion ,tiempo
        let id_respuesta = `${id_prueba}${mail_candidato}`
        let tiempo_máximo = config.time * 60  * 1000// obtenemos milisegundos de minutos 
        await connection.query(`CREATE TABLE IF NOT EXISTS respuestas (
            id_respuesta TEXT,
            id_prueba TEXT,
            tiempo_prueba INT,
            mail TEXT,
            respuestas LONGTEXT,
            feedbacks LONGTEXT,
            inicio DATETIME,
            termino DATETIME,
            puntaje_final INT
            )`)
        
        const [rows] = await connection.query(`SELECT * FROM respuestas WHERE id_respuesta = ?`,[id_respuesta])
        if(rows.length > 0){
            //existe registro previo
            console.log(rows)
            return res.status(200).json({ mensaje: 'Prueba iniciada anteriormente, retomando...', respuestas: [rows[0].respuestas.length > 0 ? rows[0].respuestas : null], inicio: rows[0].inicio})
        }
        if(rows.length == 0){
            //no existe registro previo
            connection.query(`INSERT INTO respuestas (id_respuesta, id_prueba, tiempo_prueba, mail, respuestas, feedbacks, inicio, termino, puntaje_final) VALUES (?,?,?,?,?,?,?,?,?)`, [id_respuesta, id_prueba, tiempo_máximo, mail_candidato, '', '', new Date(), '', 0])
            const token = jwt.sign({ id_respuesta }, SECRET_KEY, { expiresIn: '4h' })
            //seteamos el id de respuesta
            res.setHeader('Set-Cookie', cookie.serialize('id_respuesta', token, {
                httpOnly: false,
                secure: false,
                maxAge: 60 * 60 * 4,
                path: '/'
            }))
            return res.status(200).json({ mensaje: 'Prueba iniciada', respuestas: [] })
        }

    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no válido' });
    }
};

export default handler;