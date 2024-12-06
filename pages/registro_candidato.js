import { useState, useEffect} from "react"
import { 
    Paper, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Checkbox, 
    ListItemText, 
    Button,
    Grid2,
    TextField, 
    Box, 
    Snackbar, 
    Alert,
    Chip
  } from '@mui/material';
import { useRouter } from "next/router";
import { useAuth } from '../components/AuthProvider';



const Registro_candidato = () => {
    const [nombre, setNombre] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [email, setEmail] = useState('')
    const [tec, setTec] = useState('')
    const [puesto, setPuesto] = useState('')
    const [tecnologías, setTecnologías] = useState([])
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const router = useRouter()

    const submit = async () => {
        let result = await fetch('/api/registro_candidato', {
            method:'POST',
            body: JSON.stringify({
                nombre,
                apellido: apellidos,
                puesto: puesto,
                tecnologias: JSON.stringify({tecnologías}),
                mail: email
            })
        })
        if(result.ok){
            let data = await result.json()
            router.push('/login')
        }
    }

    return(
        <div class="container">
        <h1 class="title has-text-centered mt-4">Registro Candidato</h1>
        <section class="section" style={{textAlign:"center"}}>
            <h2 class="subtitle">Perfil del Candidato</h2>
            <div class="columns">
                <div class="column" >
                    <div class="field" >
                        <label class="label">Nombre</label>
                        <div class="control">
                            <input style={{width:"50%"}} onChange={(e)=>{setNombre(e.target.value)}} value={nombre} class="input" type="text" />
                        </div>
                    </div>
                    <div class="field" >
                        <label class="label">Apellidos</label>
                        <div class="control">
                            <input style={{width:"50%"}} onChange={(e)=>{setApellidos(e.target.value)}} value={apellidos} class="input" type="text" />
                        </div>
                    </div>
                    <div class="field" >
                        <label class="label">Email</label>
                        <div class="control">
                            <input style={{width:"50%"}} onChange={(e)=>{setEmail(e.target.value)}} value={email} class="input" type="email" />
                        </div>
                    </div>
                    <div class="field" >
                        <label class="label">Puesto</label>
                        <div class="control">
                            <input style={{width:"50%"}} onChange={(e)=>{setPuesto(e.target.value)}} value={puesto} class="input" type="text" />
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="field" >
                <label class="label">Tecnologías</label>
                <div class="control">
                    <input style={{width:"50%"}} class="input" value={tec} onChange={(e) => {setTec(e.target.value)}} type="text" id="tech-input" placeholder="Ingrese tecnologías separadas por comas"/>
                </div>
                <button class="button is-primary" style={{marginTop:'1%'}} onClick={(e) => {setTecnologías(prev => [...prev, tec]); setTec('')} }>Agregar</button>
                <div id="tech-tags" class="tags mt-2"></div>
            </div>
            
            <div id="tech-skills" style={{display:'flex', flexDirection:'row'}}>{tecnologías.map((el, index) => {
                return(
                    <div key={index}>
                        <Chip 
                        key={el} 
                        label={el} 
                        value={el} 
                        onClick={() => { 
                            setTecnologías(prev => prev.filter(p => p !== el))
                        }} 
                        />
                    </div>
                )
            })}</div>

            <div class="info-message">
                <i class="fas fa-lightbulb"></i>
                Recuerda que debes rellenar todos los datos para acceder a la prueba.
            </div>

            <div class="field mt-5">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" id="terms-checkbox"/>
                        Acepto las condiciones, la política de privacidad (LOPD) y otros términos legales
                    </label>
                </div>
            </div>

            {
                isAuthenticated ? 
            (<div class="field mt-4">
                <div class="control">
                    <button disabled={(nombre.length == 0) && (apellidos.length == 0) && (email.length == 0) && (puesto.length == 0) && (tecnologías.length == 0)} class="button is-primary" id="save-button">Guardar</button>
                </div>
            </div>)
                :
            (<div class="field mt-4">
                <div class="control">
                    <button disabled={(nombre.length == 0) && (apellidos.length == 0) && (email.length == 0) && (puesto.length == 0) && (tecnologías.length == 0)} class="button is-primary" onClick={(e) => {submit()}} id="save-button">Enviar</button>
                </div>
            </div>)
            }
        </section>
    </div>
    )
}

export default Registro_candidato