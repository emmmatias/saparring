import Loader from "@/components/Loader"
import { useState } from "react"
import { useCookies } from 'react-cookie';

const contenedor = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}


const Login_error = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['reenvio_alta']);

    const reenviar = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            let response = await fetch(`/api/reenviar_jwt_alta?email_admin=${cookies.email_admin}`)
            if(response.ok){
                let data = await response.json()
                setMessage(data.message)
            }
            if(!response.ok){
                setMessage('Hubo un error, por favor reintenta')
            }
        }catch(error){
            setLoading(false)
            setMessage('Error al enviar, por favor reintente')
        }finally{
            setLoading(false)
        }
    }

    return(
        <div style={contenedor}>
            <div style={{display: 'grid', placeItems:'center', borderColor: 'black', borderStyle: 'solid', borderWidth:'1px', padding: '2%', borderRadius:'50px', boxShadow:'2px 2px 10px rgba(0, 0, 0, 0.5)'}}>
                <h3>¡Lo sentimos!</h3>
                <h4>Parece que tu enlace ha expirado</h4>
                <p>Por favor, clickea en el botón debajo para enviarte uno nuevo</p>
                {loading ? <Loader/> : <button onClick={message.length == 0 ? (e) => {reenviar(e)}: (e) => {setMessage('')}} type="button" className="btn-view">{message.length == 0 ? 'Reenviar' : 'Entendido'}</button>}
                {message.length > 0 ? <>
                <h3>{message}</h3>
                </>:<></>}
            </div>
        </div>
    )
}

export default Login_error