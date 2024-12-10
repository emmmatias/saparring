import connection from "./db";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const SECRET_KEY = process.env.JWT_SECRET
let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { email } = await req.query
        try{

            let [feedbacks] = await connection.query('Select * from respuestas ')


            return res.status(200).json({feedbacks: arr})
        }catch(error){
            return res.status(200).json({message: error})
        }
    }
}

export default handler