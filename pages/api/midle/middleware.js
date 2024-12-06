import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = process.env.JWT_SECRET

export const authenticate = (handler) => async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie || null);

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        return handler(req, res); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};