import connection from "./db"


const handler = async (req, res) => {
    if(req.method == 'GET'){
        const { email } = req.query
        console.log(email)
        try{
            let [data] = await connection.query(`
                SELECT p.*, r.termino
                FROM pruebas p
                JOIN respuestas r ON p.mail = r.mail AND p.id = r.id_prueba
                WHERE p.mail = ?
                `, [email])
            console.log('data', data)
            
            let arr = []
            
            for(let prueba of data){
                let empresa_ = JSON.parse(prueba.config).empresa
                let finalizada = ''
                function isValidDate(dateString) {
                    const date = new Date(dateString);
                    return !isNaN(date.getTime());
                }
                isValidDate(`${prueba.termino}`) ? finalizada = '1' : finalizada = '0'
                let obj = {
                    id: prueba.id,
                    empresa: empresa_, 
                    finalizada
                }
                arr.push(obj)
            }

            return res.status(200).json({pruebas: arr})
        
        }catch(error){

        }

    }
}

export default handler