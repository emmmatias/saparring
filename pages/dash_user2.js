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
import { useState, useEffect, useRef } from 'react'
import * as cookie from 'cookie'
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";



const Dash_user2 = () => {

    const [candidato, setCandidato] = useState('')
    const [token, setToken] = useState('')
    const [page, setPage] = useState('')
    const [candidato_data, setCandidato_data] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [email, setEmail] = useState('')
    const [puesto, setPuesto] = useState('')
    const [situacion, setSituacion] = useState('')
    const [tecnologias, setTecnologias] = useState('')
    const [feedbacks, setFeedbacks] = useState([])

    let router = useRouter()

    const verificarCandidato = async () => {
        router.query.page ? setPage(router.query.page) : setPage('main')
        router.query.token ? setToken(router.query.token) : setToken(null)
        router.query.candidato ? setCandidato(router.query.candidato) : setCandidato(null)
        let response = await fetch(`/api/getCandidate2?candidato=${router.query.candidato}&token=${router.query.token}`)
        if(response.ok){
            let data = await response.json()
            console.log('data del usuario', data)
            console.log(data)
            setCandidato_data(data)
        }
        if(!response.ok){
            router.push('/')
        }
    }

    useEffect(() => {

    },[])

    useEffect(() => {
        if(page == 'config'){
            
        }
    }, [page])

    useEffect(() => {
        verificarCandidato()
    }, [])

    return(
    <>
    <div class="tabs is-centered">
            <ul>
                <li>Mi perfil</li>
                <li>Mis pruebas</li>
                <li>Mis feedbacks</li>
                <li class="is-active">Contacto</li>
            </ul>
    </div>
    {
        page == 'config' && <>
                <section class="section">
            <h2 class="subtitle">Tu perfil</h2>
            <div class="columns">
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Nombre</label>
                        <div class="control">
                            <input class="input" type="text" value="María" readonly/>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Apellidos</label>
                        <div class="control">
                            <input class="input" type="text" value="García López" readonly/>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input class="input" type="email" value="maria.garcia@email.com" readonly/>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Puesto</label>
                        <div class="control">
                            <input class="input" type="text" value="Desarrollador Full Stack" readonly/>
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Situación laboral</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Ingrese su situación laboral actual"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="field">
                <label class="label">Tecnologías</label>
                <div class="control">
                    <input class="input" type="text" id="tech-input" placeholder="Ingrese tecnologías separadas por comas"/>
                </div>
                <div id="tech-tags" class="tags mt-2">

                </div>
            </div>
            
            <div id="tech-skills" class="tech-grid">

            </div>

            <div class="info-message">
                <i class="fas fa-lightbulb"></i>
                Recuerda mantener tus datos actualizados
            </div>

            <div class="field mt-4">
                <div class="control">
                    <button class="button is-primary" id="save-button">Guardar</button>
                </div>
            </div>
        </section>
        </>
    }
    {
        page == 'tests' && <>
        
        </>
    }
    {
        page == 'feedbacks' && <>
        
        </>
    }
    </>
    )
}

export default Dash_user2