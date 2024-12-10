import connection from "./db";
import jwt, { decode } from 'jsonwebtoken';
import * as cookie from 'cookie'
import nodemailer from 'nodemailer';
const SECRET_KEY = process.env.JWT_SECRET
let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { token } = req.query
        let payload = jwt.decode(token)
        const tokenSession_empresa = token
        try{
        const decoded = jwt.verify(tokenSession_empresa, SECRET_KEY)
        let email_admin = decoded.email_admin
        let recluiter = decoded.recluiter
        console.log('reccccccccccccccccc', recluiter)
        const [rows] = await connection.query('SELECT * FROM empresas WHERE email_admin = ?', [email_admin])
        if (rows.length > 0) {
            const data_user1 = rows[0]
            const data_user = {
                ...data_user1,
            }
            //console.log('546545646545646545456465465465465465465465465465465465465', data_user['contraseña'])
            let mensajes = JSON.parse(data_user['contraseña'])
            let mensajes1 = mensajes.mensajes.filter(obj => {return(obj.reclutador_email == recluiter)})
            if(mensajes1.length > 0){
                data_user.contraseña = JSON.stringify({mensajes: mensajes1})
                //console.log(mensajes1)
                if(data_user.activo == true){
                    return res.status(200).json({ data_user })
                }else{
                    if(data_user.mail_verificado == false){
                        
                        return res.status(404).json({ message: 'Debes verificar tu email' });
                    }else{
                        
                        return res.status(404).json({ message: 'Estamos validando tu cuenta' });
                    }  
                }
            }else{
            return res.status(200).json({ data_user });
            }
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
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