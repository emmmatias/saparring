import nodemailer from 'nodemailer';
import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;

let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if(req.method == 'POST'){
        let data = await JSON.parse(req.body)
        const {
            nombre,
            apellidos,
            email,
            puesto,
            situacion,
            tecnologias
        } = data
        try{
            await connection.query(`UPDATE candidatos set nombre = ?, apellido = ?, puesto = ?, tecnologias = ?, situacion = ? where mail = ?`, [nombre, apellidos, puesto, tecnologias, situacion, email])
            return res.status(200).json({ message: 'Datos modificados con éxito' })
        }catch(error){

            return res.status(500).json({ message: error })
        }
    }
}

export default handler