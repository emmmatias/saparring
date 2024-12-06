import connection from "./db";


const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { empresa } = req.query


        
    }else{
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Método no válido' })
    }
}

export default handler