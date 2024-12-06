import nodemailer from 'nodemailer';
import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;

let BaseUrl = process.env.BASE_URL

const handler = async (req, res) => {
    if(req.method == 'POST'){
        let data = JSON.parse(req.body)
        const {
            empresa,
                cif,
                direccion,
                codigopostal,
                provincia,
                contraseña,
                ciudad,
                telefono_contacto,
                email_contacto,
                email_admin,
                logo,
                web,
                reclutadores
        } = data

        try{
            await connection.query(`UPDATE empresas SET
                empresa = ?,
                cif = ?,
                direccion = ?,
                codigopostal = ?,
                provincia = ?,
                ciudad = ?,
                telefono_contacto = ?,
                email_contacto = ?,
                logo = ?,
                web = ?,
                reclutadores = ?, contraseña = ? WHERE email_admin = ?`, [empresa, cif, direccion, codigopostal, provincia, ciudad, telefono_contacto, email_contacto, logo, web, reclutadores, contraseña, email_admin])
                return res.status(200).json({ message: 'Alta exitosa' })
            }catch(error){
            console.error(error)
            return res.status(500).json({ message: error })
        }
    }else{
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler