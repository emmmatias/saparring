import { useState, useEffect, createContext } from "react"
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Avatar
  } from '@mui/material';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";
import dash_user from "./dash_user";
import Link from 'next/link';


const Login = () => {
    const [mail, setMail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [mail_user, setMail_user] = useState('')
    const [reclutador, setReclutador] = useState('')
    const [cif, setCif] = useState(false)
    const [info, setInfo] = useState(false)
    const [info2, setInfo2] = useState(false)
    const router = useRouter()
    const { isAuthenticated, login, logout, user, userType } = useAuth()


    useEffect(()=>{
        setCif(contraseña)
    },[contraseña])

    const submit = async (e) => {
        e.preventDefault()
        console.log(`datos enviads ${mail}, ${contraseña}`)
        try{
            let response = await fetch('/api/login_empresa', {
                method: 'POST',
                body: JSON.stringify({
                    email_admin: mail,
                    contraseña : cif
                }),
            })
            if(response.ok){
                const data = await response.json();
                //window.location.href = data.redirectTo
                setInfo('Revisa tu casilla de Email para ingresar')
                //login(mail, 'empresa')
                //router.push('/dash_empresa')
            }
            if(!response.ok){
                let data = await response.json()
                if(data.error){
                    data ? setInfo(data.error) : setInfo('ocurrió un error inesperado')
                }
                if(data.message){
                        data ? setInfo(data.message) : setInfo('ocurrió un error inesperado')    
                }
            }
        }catch(err){
            alert(' Error al enviar la solicitud =( ')
            console.error(err)
        }
    }

    const submit_user = async (e) => {
        e.preventDefault()
        console.log(`datos enviads ${mail_user}`)
        try{
            let response = await fetch('/api/login_candidato', {
                method: 'POST',
                body: JSON.stringify({
                    mail: mail_user
                })
            })
            if(response.ok){
                const data = await response.json();
                //window.location.href = data.redirectTo
                //login(mail, 'candidato')
                data && setInfo2(data.message)
            }
            if(!response.ok){
                let data = await response.json()
                data.error ? setInfo2(data.error) : data.message ? setInfo2(data.message) : setInfo2('ocurrió un error inesperado')
            }
        }catch(err){
            alert(' Error al enviar la solicitud =( ')
        }
    }
    

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
        <div style={{ display: 'flex', marginLeft:'25%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '300px', height: '100%' }}>
            <Typography component="h1" variant="h5" align="center">
                Login Empresa
            </Typography>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <TextField
                    fullWidth
                    label="Mail"
                    variant="outlined"
                    margin="normal"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                    autoFocus
                />
                <TextField
                    fullWidth
                    type="text"
                    label="CIF"
                    variant="outlined"
                    margin="normal"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                />
                <Link href="/altas-empresas" style={{ textAlign: 'center' }}>¿No estás registrado?</Link>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Ingresar
                </Button>
                {info && (
                    <div style={{ textAlign: 'center' }}>
                        <h3>{info}</h3>
                        <Button onClick={() => { setInfo(false); }}>Cerrar</Button>
                    </div>
                )}
            </form>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft:'25%', alignItems: 'center', justifyContent: 'center', width: '300px', height: '100%' }}>
            <Typography component="h1" variant="h5" align="center">
                Login Candidato
            </Typography>
            <form onSubmit={submit_user} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <TextField
                    fullWidth
                    label="Mail"
                    variant="outlined"
                    margin="normal"
                    value={mail_user}
                    onChange={(e) => setMail_user(e.target.value)}
                    required
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Ingresar
                </Button>
                {info2 && (
                    <div style={{ textAlign: 'center' }}>
                        <h3>{info2}</h3>
                        <Button onClick={() => { setInfo2(false); }}>Cerrar</Button>
                    </div>
                )}
            </form>
        </div>
    </div>
    
    )
}

export default Login