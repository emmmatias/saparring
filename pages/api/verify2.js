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
        // el mail estara en payload.email_admin
        let email_admin = payload.email_admin
        let empresa = payload.empresa
        console.log('ESTA ES LA EMPRESAAAAAAA', empresa)
        let recluiter = payload.recluiter
        console.log('reccccccccccccccccccccc', recluiter)
        try{
            const decoded = jwt.verify(token, SECRET_KEY)
            let tokenSession = jwt.sign({ email_admin, recluiter, empresa}, SECRET_KEY, { expiresIn: '4h' })
            await connection.query('UPDATE empresas SET mail_verificado = ?, activo = ? WHERE email_admin = ?', [1,1, email_admin])      
            res.setHeader('Set-Cookie', cookie.serialize('empresa', tokenSession, {
                httpOnly: false,
                secure: false,
                maxAge: 60 * 60 * 4,
                path: '/dash_empresa'
                }))
            res.setHeader('Cache-control', 'no-cache')
            return res.redirect(302, '/dash_empresa')

        }catch(error){
            console.error(error)
            res.setHeader('Cache-control', 'no-cache')
            let tokenSession = {
                email_admin,
                empresa
            }
            res.setHeader('Set-Cookie', cookie.serialize('reenvio_alta', tokenSession, {
                httpOnly: false,
                secure: false,
                maxAge: 60 * 60 * 4,
                path: '/dash_empresa'
                }))
            return res.redirect(302, '/login_error')
        }



    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler