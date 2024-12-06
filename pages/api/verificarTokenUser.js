import connection from "./db";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;
let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if (req.method === 'POST') {

        try{

            const token = req.cookies['token']
            const decoded = jwt.verify(token, SECRET_KEY)
            
            console.log('DECODED', decoded)

            res.status(200).json({mail: decoded.mail})

        }catch(error){

        }

    }else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no válido' });
    }
}

export default handler