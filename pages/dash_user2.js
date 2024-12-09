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
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import Loader from '@/components/Loader';


const Dash_user2 = () => {

    const [candidato, setCandidato] = useState('')
    const [token, setToken] = useState('')
    const [page, setPage] = useState('config')
    const [candidato_data, setCandidato_data] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [inputTech, setInpuTech] = useState('')
    const [puesto, setPuesto] = useState('')
    const [situacion, setSituacion] = useState('')
    const [indice_prueba, setIndice_prueba] = useState()
    const [pruebas_previas, setPruebas_previas] = useState([])
    const [tecnologias, setTecnologias] = useState([])
    const [feedbacks, setFeedbacks] = useState([])
    const [urlParams, setUrlParams] = useState({});
    const router = useRouter()

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setUrlParams(params);
    }, []);

    const obtener_feedbacks = async () => {
        let response = await fetch(`/api/obtener_feedbacks_candidato?email=${email}`)
        
    }

    const obtener_pruebas_previas = async (indice_prueba) => {
        let response = await fetch(`/api/obtener_pruebas_previas?email=${email}`)
        if(response.ok){
            let data = await response.json()
            console.log(data.pruebas)
            setPruebas_previas(data.pruebas)
        }
    }

    useEffect(() => {
        if(page == 'tests'){
            obtener_pruebas_previas()
        }
        if(page == 'feedbacks'){
            //obtener_feedbacks()
        }
    }, [page])

    const verificarCandidato = async () => {
        setLoading(true)
        const params = new URLSearchParams(window.location.search);
        setUrlParams(params)
        setPage(params.get('page'))
        setToken(params.get('token'))
        setCandidato(params.get('candidato'))
        let response = await fetch(`/api/getCandidate2?candidato=${params.get('candidato')}&token=${params.get('token')}`)
        if(response.ok){
            let data = await response.json()
            console.log('data del usuario', data)
            console.log(data)
            setNombre(data.nombre)
            setApellidos(data.apellido)
            setEmail(data.mail)
            setPuesto(data.puesto)
            setSituacion(data.situacion)
            setCandidato_data(data)
            setTecnologias([...JSON.parse(data.tecnologias).tecnologias])
            setFeedbacks([...JSON.parse(data.feedbacks).feedbacks])
            setLoading(false)
        }
        if(!response.ok){
            router.push('/')
        }
    }

    const handleInputAdd = (e) => {
        e.preventDefault()
        if(!tecnologias.some(el => {el == `${inputTech}`}) && inputTech.length > 0){
            setTecnologias(prev => [...prev, inputTech])
            setInpuTech('')
        }
    }

    const modificar_candidato = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            let response = await fetch('/api/modificar_candidato',{
                method: 'POST',
                body: JSON.stringify({
                    nombre,
                    apellidos,
                    email,
                    puesto,
                    situacion,
                    tecnologias: JSON.stringify({
                        tecnologias
                    })
                })
            })
            if(response.ok){
                let data = await response.json()
                setMessage(data.message)
            }
            if(!response.ok){
                let data = await response.json()
                setMessage(data.message)
            }
        }catch(error){
            console.error(error)
            setMessage(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        verificarCandidato()
    }, [])

    const seguirPrueba = (id) => {
        
    }

    return(
    <>
    <div class="tabs is-centered">
            <ul>
                <li onClick={(e) => setPage('config')} style={page == 'config' ? {backgroundColor:'rgba(128, 128, 128, 0.5)'} : {}}><a>Mi perfil</a></li>
                <li onClick={(e) => setPage('tests')} style={page == 'tests' ? {backgroundColor:'rgba(128, 128, 128, 0.5)'} : {}}><a>Mis pruebas</a></li>
                <li onClick={(e) => setPage('feedbacks')} style={page == 'feedbacks' ? {backgroundColor:'rgba(128, 128, 128, 0.5)'} : {}}><a>Mis feedbacks</a></li>
            </ul>
    </div>
    {
        page == 'config' && <>
        {
            loading ? <div style={{height:'100vh'}}><Loader/></div> : <section class="section">
            <h2 class="subtitle">Tu perfil</h2>
            <div class="columns">
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Nombre</label>
                        <div class="control">
                            <input class="input" type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Apellidos</label>
                        <div class="control">
                            <input class="input" type="text" onChange={(e) => setApellidos(e.target.value)}  value={apellidos} />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input class="input" type="email" value={email} readonly/>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Puesto</label>
                        <div class="control">
                            <input class="input" type="text" onChange={(e) => setPuesto(e.target.value)}  value={puesto} />
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Situación laboral</label>
                        <div class="control">
                            <input class="input" type="text" onChange={(e) => setSituacion(e.target.value)}  value={situacion} placeholder="Ingrese su situación laboral actual"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="field">
                <label class="label">Tecnologías</label>
                <div class="control">
                    <input class="input" onChange={(e) => {setInpuTech(e.target.value)}} type="text" id="tech-input" placeholder="Ingrese tecnologías" />
                    <button className="button" onClick={(e) => {handleInputAdd(e)}}>Agregar</button>
                </div>
                <div id="tech-tags" class="tags mt-2">
                    {tecnologias.map((el, index) => {
                        return(
                            <Chip label={`${el}`}/>
                        )
                    })}
                </div>
            </div>
            
            <div id="tech-skills" class="tech-grid">

            </div>

            <div class="info-message">
                <i class="fas fa-lightbulb"></i>
                Recuerda mantener tus datos actualizados
            </div>

            <div class="field mt-4">
                {loading == false ? <div class="control">
                    <button onClick={message.length == 0 ? (e) => {modificar_candidato(e)}: (e) => {setMessage('')}} class="button is-primary" id="save-button">{message.length == 0 ? 'Guardar' : 'Entendido'}</button>
                </div> : <Loader/>}
                {
                    loading == false && <h4>{`${message}`}</h4>
                }
            </div>
                </section>
        }
        </>
    }
    {
        page == 'tests' && 
        <div style={{height:'100vh'}}>
        {
            pruebas_previas.length > 0 ? 
            <table className="feedback-table">
            <thead>
                <tr>
                    <th>ID Prueba</th>
                    <th>Empresa</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                pruebas_previas.map((el, index) => {
                    return(
                        <tr key={index}>
                            <td><span class="test-id">{el.id}</span></td>
                            <td>{el.empresa}</td>
                            <td>
                            {el.finalizada == '0' && <button className="button" onClick={(e) => router.push(`/talent?prueba_id=${el.id}&mail=${email}`)}>Seguir la prueba</button>}
                            {el.finalizada == '1' && <button className="button" onClick={(e) => setPage('feedbacks')}>Revisa la sección de feedbacks</button>}
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table> : <div style={{height:'100vh'}}><Loader/></div>
        }
        </div>
    }
    {
        page == 'feedbacks' && 
        <div style={{height:'100vh'}}>
        {
            feedbacks.length > 0 ? <table className="feedback-table">
            <thead>
                <tr>
                <th>ID Prueba</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    feedbacks.map((el, index) => {
                        return(
                            <tr key={index}>
                                <td><span class="test-id">{el}</span></td>
                                <td>
                                <button className="button" onClick={(e) => {router.push(`/api/enviarfeedback?id=${el}&candidato=${email}`)}}>Ver feedback</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table> : <div style={{height:'100vh'}}><Loader/></div>
        }
        </div>
    }
    </>
    )
}

export default Dash_user2