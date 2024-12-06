import connection from "./db";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'
const SECRET_KEY = process.env.JWT_SECRET;

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const data_post = JSON.parse(req.body);
        const mail = data_post.mail;
        const contraseña = data_post.contraseña;

        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mail VARCHAR(255) NOT NULL UNIQUE,
                contraseña VARCHAR(255),
                activo BOOLEAN DEFAULT FALSE,
                tipo VARCHAR(20) NOT NULL,
                config_user TEXT
            )`);

            const [rows] = await connection.query('SELECT * FROM usuarios WHERE contraseña = ? AND mail = ?', [contraseña, mail]);

            if (rows.length > 0) {
                const data_user = rows[0];
                const tipo_usuario = data_user.tipo;

                // Crear el token
                const token = jwt.sign({ mail: data_user.mail }, SECRET_KEY, { expiresIn: '4h' });

                // Establecer la cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 4,
                    path: '/'
                }));

                // Redirigir según el tipo de usuario
                let redirectUrl;
                switch (tipo_usuario) {
                    case 'admin':
                        redirectUrl = '/dash_admin';
                        break;
                    case 'empresa':
                        redirectUrl = '/dash_empresa';
                        break;
                    case 'user':
                        redirectUrl = '/dash_user';
                        break;
                    default:
                        return res.status(400).json({ error: 'Tipo de usuario no válido' });
                }

                // Enviar la respuesta de redirección
                return res.status(200).json({ redirectTo: redirectUrl });
            } else {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no válido' });
    }
};

export default handler;