import { useState, useEffect, createContext } from "react"
import { useCookies } from 'react-cookie';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Avatar
  } from '@mui/material';
import InterviewSelector2 from "@/components/InterviewSelector2";
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";
import SidebarEmpresa from '../components/SideBar_empresa'
import Generated_tests from "@/components/Generated_tests";
import { Padding } from "@mui/icons-material";
import Feedbacks from "@/components/Feedbacks";
import Login from ".";
import Loader from "@/components/Loader";

let stile = {
    display: 'grid',
    gridTemplateColumns: '0.5fr 3.5fr',
    gap: '2px',
}


const Dash_empresa = () => {
    const [openSettings, setOpenSettings] = useState(false)
    const [openHistori, setOpenHistori] = useState(false)
    const [page, setPage] = useState('main')
    const [messageEdit, setMessageEdit] = useState(true)
    const [mensajesConfig, setMensajesConfig] = useState([{value: 'Valor por defecto'},{value: 'Valor por defecto'},{value: 'Valor por defecto'},'Ana García'])
    const [config, setConfig] = useState()
    const [recluiter,setRecluiter] = useState()
    const [selected, setSelected] = useState('edit')
    const [datamessage, setdatamessage] = useState('')
    const [visible, setvisible] = useState()
    const [clicked, setClicked] = useState()
    const [login1, setlogin1] = useState(false)
    const [detailed, setDetailed] = useState('')
    const [descripción_empresa, setdescripción_empresa] = useState()
    const [descripción_prueba, setdescripción_prueba] = useState()
    const [reclutador, setreclutador] = useState()
    const [siguientes_pasos, setsiguientes_pasos] = useState()
    const [mensaje_personal, setmensaje_personal] = useState()
    const [contacto_reclutador, setcontacto_reclutador] = useState()
    const [reclutador_telefono, setreclutador_telefono]= useState()
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const [cookies, setCookie, removeCookie] = useCookies(['empresa']);
    const router = useRouter()

    const verificar_empresa = async () => {
        if(cookies.empresa){
            let response = await fetch(`/api/verify3?token=${cookies.empresa}`)
            if(response.ok){
                let data = await response.json()
                console.log('Los la data del usuario::::', JSON.parse(data.data_user.contraseña).mensajes)
                setConfig(data.data_user)
                let mensajes = JSON.parse(data.data_user.contraseña).mensajes[0].mensajes
                setMensajesConfig(mensajes)
                let recluiter = JSON.parse(data.data_user.contraseña).mensajes[0].reclutador_email
                setRecluiter(recluiter)
                login(data.data_user.email_admin, 'empresa')
                ////////////////////////////////////////////////
                const url = new URL(window.location.href)
                const params = url.searchParams
                console.log(params.get('prueba'))
                if(params.get('prueba')){
                    setPage('feedbacks')
                    setDetailed(params.get('prueba'))
                }
            }
        if(!response.ok){
            router.push('/')
        }
        }else{
            router.push('/')
        }
        
    }

    useEffect(() => {
        setdescripción_empresa(mensajesConfig.descripción_empresa || 'No definido')
        setdescripción_prueba(mensajesConfig.descripción_prueba || 'No definido')
        setreclutador(mensajesConfig.reclutador || 'No definido')
        setsiguientes_pasos(mensajesConfig.siguientes_pasos || 'No definido')
        setmensaje_personal(mensajesConfig.mensaje_personal || 'No definido')
        setcontacto_reclutador(mensajesConfig.contacto_reclutador || 'No definido')
        setreclutador_telefono(mensajesConfig.reclutador_telefono || 'No definido')
    },[mensajesConfig])

    useEffect(() => {
        console.log('cookies:', cookies.empresa)
            console.log(document.cookie)
            verificar_empresa();
    },[])

    useEffect(() => {
        
            console.log('PAGE ACTU', page)
            
    },[page])

    const generarConsulta = () => {
        setPage('generar')
        setOpenSettings(true)
    }

    const guardarConfig = async (numero) => {
        setClicked(numero)
        setlogin1(true)
        console.log('guardando config')
        let response  = await fetch('/api/guardar_config', {
            method:'POST',
            body: JSON.stringify({
                mail: user,
                reclutador: recluiter,
                mensajes: {
                mensajes:{
                descripción_empresa,
                descripción_prueba,
                reclutador,
                siguientes_pasos,
                mensaje_personal,
                contacto_reclutador,
                reclutador_telefono}
                }
            })
        })
        if(response.ok){
            setlogin1(false)
            setvisible(true)
            setdatamessage('Datos guardados')
        }else{
            setlogin1(false)
            setvisible(true)
            setdatamessage('Error al guardar')
        }
    }
     const generarTexto = async (tipo, numero) => {
        setlogin1(true)
        setClicked(numero)
        let response = await fetch('/api/generar_texto', {
            method:'POST',
            body: JSON.stringify({
                tipo,
                mensaje_personal,
                recluiter,
                descripción_empresa,
                descripción_prueba
            })
        })
        if(response.ok){
            let data = await response.json()
            console.log('texto_generado', data.data)
            if(data.tipo_des == 'descripcion'){
                setdescripción_empresa(data.data)
            }
            if(data.tipo_des == 'descripcion prueba'){
                setdescripción_prueba(data.data)
            }
            if(data.tipo_des == 'mensaje personal'){
                setmensaje_personal(data.data)
            }
            setlogin1(false)
        }
        if(!response.ok){
            let data = await response.json()
            setlogin1(false)
        }
     }

    const main = () => {
        setPage('main')
    }

    const toComming = () => {
        router.push('/CommingSoon')
    }

    const alta = () => {
        router.push('altas-empresas')
    }
    
    const message_config = () => {
        setPage('message_config')
    }

    const abrirHistorial = () => {
        setPage('historial')
        setOpenHistori(true)
    }
    const abrirFeedbacks = () => {
        setPage('feedbacks')
    }

    const style22 = {
        popup: {
            display: 'block', /* Usar flex para centrar el contenido */
            position: 'fixed', /* Fijo en la ventana */
            zIndex: 1000, /* Por encima de otros elementos */
            marginLeft: '35%',
            width: '30%',
            height: '20%',
            marginTop: '20%', 
            textAlign: 'center',
            backgroundColor: 'white', /* Fondo semi-transparente */
            borderColor: 'black',
            alignItems: 'center',
            BorderStyle: 'solid',
            borderRadius: '10px',
            boxShadow:'2px 2px 10px 2px rgba(0, 0, 0, 0.5)',
            padding:'1%'
        }
      }

    return(
    <div >
        {visible && (
                      <div style={style22.popup}>
                        <p style={{marginTop:'4%'}}>{datamessage}</p>
                        <center><button class="ai-button" onClick={(e) => {setvisible(null)}}>cerrar</button></center>
                      </div>
        )}

        <div style={stile}>
            <div >
                {/*debemos pasarle las funciones para que funcione como menu*/}
            <SidebarEmpresa abrirFeedbacks={abrirFeedbacks} toComming={toComming} message_config={message_config} abrirHistorial={abrirHistorial} alta={alta} generarConsulta={generarConsulta} />
            </div>
            <div style={{height: '100vh', overflow: 'scroll', overflowX: 'hidden'}}>
            {isAuthenticated == true ? 
        <div style={{maxWidth:'100%', paddingBottom:'10%', paddingTop:'1%'}}>
            {(page == 'main') && 
                <div>
                <div style={{margin:"2%", padding:'2%', display:'inline-block', borderColor:"black", borderStyle:'solid', boxShadow:'2px 2px 10px 2px rgba(0, 0, 0, 0.5)', borderRadius:'10px'}}>
                <h2 style={{marginBottom:'1%'}}>Bienvenido a su dashboard:</h2>
                <h4>Los datos de esta sesión son:</h4>
                <p>{`Empresa: ${config.empresa}`}</p>
                <p>{`Recluiter: ${recluiter}`}</p>
                </div>
                <div>
                    
                </div>
                </div>}
            {page === 'generar' ? <InterviewSelector2 main={main} recluiter={recluiter} empresa={config.empresa}/> : null}
            {page === 'historial' && <Generated_tests main={main} />}
            {page === 'message_config' && (
            <div style={{marginBottom:'5%', marginLeft:'2%'}}>
            <div class="tab-container">
        <button class="tab" style={ selected == 'edit' ? {backgroundColor: 'rgba(128, 128, 128, 0.5)'} : {}} onClick={(e) => {setMessageEdit(true); setSelected('edit')}}>Edición</button>
        <button class="tab" style={ selected == 'vista' ? {backgroundColor: 'rgba(128, 128, 128, 0.5)'} : {}} onClick={(e) => {setMessageEdit(false); setSelected('vista')}}>Vista Previa</button>
    </div>
    {messageEdit ? <div id="edit-section" style={{marginTop:'5%'}}>
        <h2 class="section-title">
            <span class="material-icons">business</span>
            Información de la Empresa
        </h2>
        <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input type="text" class="text-field" value={config.empresa? config.empresa : 'Valor predefinido'}  placeholder="Ej: Wuilders Labs"/>
        </div>
        <div class="form-group">
            <label>Descripción de la Empresa</label>
            <div id="companyDescription" class="editor-container">
                <textarea name={'companyDescription'} onChange={(e) => {setdescripción_empresa(e.target.value)}} value={descripción_empresa} style={{width: '100%', height: '100%', resize: 'none'}}></textarea>
            </div>
            <button onClick={(e) => {generarTexto('descripcion', 1)}} class="ai-button" >
                <span  class="material-icons">smart_toy</span>
                Generar con IA
                {(login1 == true && clicked == 1) && <Loader/>}
            </button>
        </div>

        <h2 class="section-title">
            <span class="material-icons">description</span>
            Descripción de la Prueba
        </h2>
        <div class="form-group">
            <label>Descripción de la Prueba</label>
            <div id="testDescription" class="editor-container">
            <textarea name={'testDescription'} onChange={(e) => {setdescripción_prueba(e.target.value)}} value={descripción_prueba} style={{width: '100%', height: '100%', resize: 'none'}}></textarea>
            </div>
            <button onClick={(e) => {generarTexto('descripcion prueba', 2)}} class="ai-button" >
                <span class="material-icons">smart_toy</span>
                Generar con IA
                {(login1 == true && clicked == 2) && <Loader/>}
            </button>
        </div>

        <h2 class="section-title">
            <span class="material-icons">settings</span>
            Configuración de la Prueba
        </h2>
        <div class="form-group">
            <label>Categoría</label>
            <div class="readonly-field">
                <span class="material-icons">category</span>
                <span id="test-category" class="readonly-text">Desarrollo Full Stack</span>
                <span class="badge">Variable predefinida</span>
            </div>
        </div>
        <div class="form-group">
            <label>Nivel</label>
            <div class="readonly-field">
                <span class="material-icons">trending_up</span>
                <span id="test-level" class="readonly-text">Senior</span>
                <span class="badge">Variable predefinida</span>
            </div>
        </div>
        <div class="form-group">
            <label>Tecnologías</label>
            <div class="readonly-field technologies-list">
                <span class="material-icons">code</span>
                <div class="tech-tags" id="test-technologies">
                    <span class="tech-tag">JavaScript (ES6+)</span>
                    <span class="tech-tag">React</span>
                    <span class="tech-tag">Node.js</span>
                    <span class="tech-tag">Express</span>
                    <span class="tech-tag">MongoDB</span>
                </div>
                <span class="badge">Variable predefinida</span>
            </div>
        </div>
        <div class="form-group">
            <label>Duración</label>
            <div class="readonly-field">
                <span class="material-icons">schedule</span>
                <span id="test-duration" class="readonly-text">2:00 horas</span>
                <span class="badge">Variable predefinida</span>
            </div>
        </div>

        <h2 class="section-title">
            <span class="material-icons">person</span>
            Mensaje del Recruiter
        </h2>
        <div class="form-group">
            <label>Nombre del Recruiter</label>
            <input type="text" class="text-field" onChange={(e) => {setreclutador(e.target.value)}} value={reclutador} placeholder="Ej: Ana García"/>
        </div>
        <div class="form-group">
            <label>Email Contacto Recruiter</label>
            <input type="text" class="text-field" onChange={(e) => {setcontacto_reclutador(e.target.value)}} value={contacto_reclutador} placeholder="Ej: Ana García"/>
        </div>
        <div class="form-group">
            <label>Telefono Contacto</label>
            <input type="text" class="text-field" onChange={(e) => {setreclutador_telefono(e.target.value)}} value={reclutador_telefono} placeholder="Ej: Ana García"/>
        </div>
        <div class="form-group">
            <label>Mensaje Personal</label>
            <div id="recruiterMessage" class="editor-container">
            <textarea name={'recruiterMessage'} onChange={(e) => {setmensaje_personal(e.target.value)}} value={mensaje_personal} style={{width: '100%', height: '100%', resize: 'none'}}></textarea>
            </div>
            <button onClick={(e) => {generarTexto('mensaje personal', 3)}} class="ai-button" >
                <span class="material-icons">smart_toy</span>
                Generar con IA
                {(login1 == true && clicked == 3) && <Loader/>}
            </button>
        </div>

        <div class="form-group company-logo">
            <label>Logo de Empresa</label>
            <div class="readonly-field logo-display">
                <span class="material-icons company-icon">business</span>
                <span class="readonly-text">Logo configurado en ajustes de empresa</span>
                <span class="badge">Variable predefinida</span>
            </div>
        </div>
        <button class="ai-button"  onClick={(e) => {(guardarConfig(4))}}>
                    <span className="material-icons">save</span>
                    Guardar Cambios
                    {(login1 == true && clicked == 4) && <Loader/>}
        </button>
    </div> : (<>
    <div id="preview-section" class="preview-section" style={{marginTop:'5%'}}>
        <h1 class="preview-title">Descripción de la Prueba Técnica</h1>
        <div class="preview-columns">
            <div class="preview-card">
                <div class="preview-logo">
                    <span class="material-icons company-icon">business</span>
                </div>
                <h3>Resumen de la Prueba</h3>
                <p>{descripción_prueba}</p>
                <p><strong>Empresa:</strong>{config.empresa}</p>
                <p><strong>ID Prueba:</strong> <span class="id-badge">WL-FS-2024-001</span></p>
                <div id="previewCompanyDescription"></div>
                <p><strong>Categoría:</strong> Desarrollo Full Stack</p>
                <p><strong>Nivel:</strong> Senior</p>
                <p><strong>Duración estimada:</strong> 2 horas</p>
                <div class="message-box">
                    <p><strong>{reclutador}, Tech Talent Specialist:</strong></p>
                    <div id="previewRecruiterMessage">
                        {mensaje_personal}
                    </div>
                </div>
            </div>
            <div class="preview-card">
                <h3>Explicación de la Prueba</h3>
                <div id="previewTestDescription">
                    {descripción_prueba}
                </div>
                <div class="technologies-preview">
                    <p><strong>Tecnologías evaluadas:</strong></p>
                    <div class="tech-tags">
                        <span class="tech-tag">JavaScript (ES6+)</span>
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">Express</span>
                        <span class="tech-tag">MongoDB</span>
                        <span class="tech-tag">TypeScript</span>
                        <span class="tech-tag">Git</span>
                        <span class="tech-tag">Docker</span>
                    </div>
                </div>
            </div>
        </div>
        <button class="ai-button"  onClick={(e) => {(guardarConfig(5))}}>
                    <span className="material-icons">save</span>
                    Guardar Cambios
                    {(login1 == true && clicked == 5) && <Loader/>}
        </button>
    </div>
    </>)}
            </div>           
            )}
            {page == 'feedbacks' && (
            <div style={{width:'100%'}}>
            <Feedbacks detailed={detailed}/>
            </div>)}
        </div> : <h2> Cargando ...</h2>}
            </div>
        </div>
    </div>
    )
}

export default Dash_empresa