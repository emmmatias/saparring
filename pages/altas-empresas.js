import { Preview } from "@mui/icons-material"
import { fabClasses, Paper } from "@mui/material"
import { useState, useEffect} from "react"
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";
import { transform } from "next/dist/build/swc";


const Altas_empresas = () => {
    const [empresa, setEmpresa] = useState()
    const [contraseña, setContraseña] = useState()
    const [cif, setCif] = useState()
    const [step, setStep] = useState(0)
    const [direccion, setDireccion] = useState()
    const [codigopostal, setCodigopostal] = useState()
    const [provincia, setProvincia] = useState()
    const [ciudad, setCiudad] = useState()
    const [telefono_contacto, setTelefono_contacto] = useState()
    const [email_contacto, setEmail_contacto] = useState()
    const [email_admin, setEmail_admin] = useState()
    const [logo, setLogo] = useState()
    const [logorec, setLogorec] = useState()
    const [web, setWeb] = useState() 
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviewrec, setImagePreviewrec] = useState(null);
    const [reclutadores, setReclutadores] = useState([])
    const [reclutador_nombre, setReclutador_nombre] = useState()
    const [reclutador_email, setReclutador_email] = useState()
    const [reclutador_telefono, setReclutador_telefono] = useState()
    const [reclutador_apellido, setReclutador_apellido] = useState()
    const [reclutador_red, setReclutador_red] = useState()
    const [ims, setIms] = useState([])
    const [message, setMessage] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [reclutador_posicion, setReclutador_posicion] = useState()
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const router = useRouter()

    const cargar_datos = async (user) =>{
        console.log(user)
        let response  = await fetch(`/api/cargar_empresa?mail=${user}`)
        if(response.ok){
            let data = await response.json()
            console.log('respuesta obtenida', data.respuesta)
            setEmpresa(data.respuesta.empresa)
            setContraseña(data.respuesta.contraseña)
            setCif(data.respuesta.cif)
            setDireccion(data.respuesta.direccion)
            setCodigopostal(data.respuesta.codigopostal)
            setProvincia(data.respuesta.provincia)
            setCiudad(data.respuesta.ciudad)
            setTelefono_contacto(data.respuesta.telefono_contacto)
            setEmail_contacto(data.respuesta.email_contacto)
            setEmail_admin(data.respuesta.email_admin)
            setLogo(data.respuesta.logo)
            setWeb(data.respuesta.web)
            let reclutadores_previos = data.respuesta.reclutadores
            let obj = JSON.parse(reclutadores_previos)
            setReclutadores(obj.reclutadores)
            setImagePreview(data.respuesta.logo)
        }
    }
    

    useEffect(() => {
        
            if(isAuthenticated){
                if(userType == 'empresa'){
                    cargar_datos(user)
                    console.log('esta autenticado y es empresa')
                }
            }
        console.log('autenticado:', isAuthenticated, 'tipo', userType)
    }, [isAuthenticated, userType])

    const submit = async (e) => {
        setMessage('')
        setIsOpen(false)
        e.preventDefault()
        if(isAuthenticated){
            let response = await fetch('/api/modif_empresa',{
                method: 'POST',
                body: JSON.stringify({
                    empresa,
                    cif,
                    direccion,
                    codigopostal,
                    contraseña,
                    provincia,
                    ciudad,
                    telefono_contacto,
                    email_contacto,
                    email_admin,
                    logo: imagePreview ? imagePreview : undefined,
                    web,
                    reclutadores: JSON.stringify({reclutadores})
                })
            })
            if(response.ok){
                router.push('/')
            }else{
                setMessage(`Algo salió mal: ${data.error}`)
                setIsOpen(true)
            }
        }
        if(!isAuthenticated){
            let response = await fetch('/api/alta_empresa', {
                method:'POST',
                body: JSON.stringify({
                    empresa,
                    cif,
                    direccion,
                    codigopostal,
                    contraseña,
                    provincia,
                    ciudad,
                    telefono_contacto,
                    email_contacto,
                    email_admin,
                    logo: imagePreview ? imagePreview : undefined,
                    web,
                    reclutadores: JSON.stringify({reclutadores})
                })
            })
            if(response.ok){
                let data = await response.json()
                console.log(data)
                setStep(1)
            }if(!response.ok){
                let data = await response.json()
                if(reclutadores.length == 0){
                    setMessage(`¡Momento!: Debes añadir aunque sea un Recluiter`)
                    setIsOpen(true)
                }
                else if(reclutadores.length > 0){
                setMessage(`Algo salió mal: ${data.error}`)
                setIsOpen(true)
            }
            }
        }
    }

    const closeModal = (e) => {
        e.preventDefault()
        setIsOpen(false)
        setMessage('')
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFile = (file) => {
        setLogo(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };
    {/* sldjksdfksmdlsdmñlsmdñlmsñlmdsñlmdsñlmdsñldmsñlmñ */}
    const handleDroprec = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFilerec(file);
        }
    };

    const handleDragOverrec = (e) => {
        e.preventDefault();
    };

    const handleFilerec = (file) => {
        setLogorec(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewrec(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const renderLogo = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // Retornar la URL de datos
            };
            reader.readAsDataURL(file);
        });
    };

    const handleInputChangerec = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFilerec(file);
        }
    };

    const añadir_recluiter = async () => {
    let obj = {
            logo: logorec ? await renderLogo(logorec) : undefined,
            reclutador_nombre,
            reclutador_apellido,
            reclutador_posicion,
            empresa,
            reclutador_telefono,
            reclutador_email,
            reclutador_red
    }
    setReclutadores(prev => [...prev, obj]) 
    setLogorec()
    setReclutador_apellido('')
    setReclutador_nombre('')
    setReclutador_posicion('')
    setReclutador_telefono('')
    setReclutador_email('')
    setReclutador_red('')
    }

    useEffect(() => {
        console.log(reclutadores)
    }, [reclutadores])
    const style22 = {
        popup: {
            display: 'block', 
            position: 'fixed',
            zIndex: 1000, 
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'white', 
            borderColor: 'black',
            alignItems: 'center',
            BorderStyle: 'solid',
            borderRadius: '10px',
            boxShadow:'2px 2px 10px 2px rgba(0, 0, 0, 0.5)',
            padding:'5%'
        }
      }


    useEffect(() => {
        console.log(logo)
    },[logo])

    return(
        <>
        {  isOpen && <div style={style22.popup}>
          <p>{message}</p>
          <button className="btn-feedback" onClick={(e) => {closeModal(e)}}>Cerrar</button>
          <button className="btn-feedback" onClick={(e) => {submit(e)}}>Reenviar</button>
        </div>}
        {isAuthenticated && <h4 onClick={(e) => {router.push('/dash_empresa')}}>← volver</h4>}
        { (step == 0) && (<div class="container">
        <div class="paper">
            {!isAuthenticated ? <h1 class="header-title" style={{color: "#1976d2"}}>Registro de empresa en Sparring</h1> : <h1 class="header-title" style={{color: "#1976d2"}}>Modifica los datos de tu empresa</h1>}
            <form id="empresaForm" onSubmit={(e) => {submit(e)}}>              
                <div class="form-section">
                    <h2>Datos de la empresa</h2>              
                    <div class="form-row">
                        <div class="form-field">
                            <label for="nombre">Nombre de la empresa *</label>
                            <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} id="nombre" required class="mui-textfield"/>
                        </div>
                        <div class="form-field">
                            <label for="cif">CIF *</label>
                            <input type="text" value={cif} onChange={e => setCif(e.target.value)} id="cif" required class="mui-textfield"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="direccion">Dirección *</label>
                            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} id="direccion" required class="mui-textfield"/>
                        </div>
                        <div class="form-field">
                            <label for="cp">Código Postal *</label>
                            <input type="text" value={codigopostal} onChange={e => setCodigopostal(e.target.value)} id="cp" required class="mui-textfield"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="provincia">Provincia *</label>
                            <input type="text" value={provincia} onChange={e => setProvincia(e.target.value)} id="provincia" required class="mui-textfield"/>
                        </div>
                        <div class="form-field">
                            <label for="ciudad">Ciudad *</label>
                            <input type="text" value={ciudad} onChange={e => setCiudad(e.target.value)} id="ciudad" required class="mui-textfield"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="telefono">Teléfono de contacto *</label>
                            <input type="tel" id="telefono" required class="mui-textfield" 
                            value={telefono_contacto} onChange={e => setTelefono_contacto(e.target.value)} placeholder="+34 XXX XXX XXX"/>
                        </div>
                        <div class="form-field">
                            <label for="emailContacto">Email de contacto *</label>
                            <input value={email_contacto} onChange={e => setEmail_contacto(e.target.value)} type="email" id="emailContacto" required class="mui-textfield"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="web">Web de la empresa</label>
                            <input type="text" value={web} onChange={(e) => setWeb(e.target.value)} id="web" placeholder="https://www.empresa.com" class="mui-textfield"/>
                        </div>
                        <div class="form-field">
                            <label for="emailAdmin">Email de administrador *</label>
                            <input disabled={isAuthenticated} value={email_admin} onChange={e => setEmail_admin(e.target.value)} type="email" id="emailAdmin" required class="mui-textfield"/>
                        </div>
                        <div style={{display: "none"}}>
                            <label for="nombre">Contraseña *</label>
                            <input type="text" value={contraseña} onChange={e => setContraseña(e.target.value)} id="contraseña"  class="mui-textfield"/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label>Logo de la empresa</label>
                            <div
            className="dropzone"
            id="logoDropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <span className="material-icons">cloud_upload</span>
            <div className="dropzone-text">Arrastra el logo aquí o haz clic para seleccionar</div>
            <div className="dropzone-subtext">PNG, JPG o GIF (max. 2MB)</div>
            <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                id="logoInput"
                style={{ display: 'none' }} // Ocultar el input
            />
            <label htmlFor="logoInput" style={{ cursor: 'pointer' }}>
                Haz clic aquí para seleccionar un archivo
            </label>
                            </div>
                        </div>
                        <div id="logoPreview" class="preview-container">
                        {imagePreview && (
                            <div>
                                <img
                            class="preview-image"
                            src={imagePreview}
                            alt="Vista previa"
                            />
                        <span class="material-icons preview-remove" onClick={(e) => {setImagePreview(null)}}>
                        delete
                        </span>
                            </div>
                        )}
                        </div>
                        <div class="form-field">
                            <label for="creditos">Créditos</label>
                            <input type="text" id="creditos" value="lifetime" readonly class="mui-textfield"/>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                
                <div class="form-section">
                    <h2>Recruiters</h2>
                    <div id="recruiters-container">
                        <div class="recruiter-card">
                            <div class="form-row">
                                <div class="form-field">
                                    <label for="recruiterNombre">Nombre *</label>
                                    <input type="text" value={reclutador_nombre} onChange={(e) => setReclutador_nombre(e.target.value)} required class="mui-textfield"/>
                                </div>
                                <div class="form-field">
                                    <label for="recruiterApellidos">Apellidos *</label>
                                    <input type="text" value={reclutador_apellido} onChange={(e) => setReclutador_apellido(e.target.value)} required class="mui-textfield"/>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label for="recruiterEmail">Email *</label>
                                    <input type="email" value={reclutador_email} onChange={(e) => setReclutador_email(e.target.value)} required class="mui-textfield"/>
                                </div>
                                <div class="form-field">
                                    <label for="recruiterLinkedin">Perfil de LinkedIn</label>
                                    <input type="text" value={reclutador_red} onChange={(e) => setReclutador_red(e.target.value)} placeholder="https://www.linkedin.com/in/usuario" class="mui-textfield"/>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label for="recruiterPosicion">Posición</label>
                                    <input type="text" value={reclutador_posicion} onChange={(e) => setReclutador_posicion(e.target.value)} placeholder="Recruitment Senior" class="mui-textfield"/>
                                </div>
                                <div class="form-field">
                                    <label for="recruiterTelefono">Teléfono candidatos</label>
                                    <input type="tel" value={reclutador_telefono} onChange={(e) => setReclutador_telefono(e.target.value)} class="mui-textfield"/>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Foto del recruiter</label>
                                    <div
                                    className="dropzone"
                                    id="logoDropzone"
                                    onDrop={handleDroprec}
                                    onDragOver={handleDragOverrec}
                                >
                                    <span className="material-icons">cloud_upload</span>
                                    <div className="dropzone-text">Arrastra el logo aquí o haz clic para seleccionar</div>
                                    <div className="dropzone-subtext">PNG, JPG o GIF (max. 2MB)</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleInputChangerec}
                                        id="logoInput"
                                        style={{ display: 'none' }} // Ocultar el input
                                    />
                                    <label htmlFor="logoInput" style={{ cursor: 'pointer' }}>
                                        Haz clic aquí para seleccionar un archivo
                                    </label>
                            </div>
                                </div>
                            </div>
                            <div class="preview-recruiter-card">
                                <h3>Vista previa de la ficha</h3>
                                <div class="recruiter-preview">
                                    <div class="recruiter-preview-header">
                                        <div class="recruiter-avatar">
                                            {imagePreviewrec ? <img src={imagePreviewrec} alt="Avatar de Ana García"/> : <img src="https://i.pravatar.cc/64" alt="Imagen de prueba"/>}
                                        </div>
                                        <div class="recruiter-info">
                                            <div class="recruiter-name">{reclutador_nombre}</div>
                                            <div class="recruiter-position">{reclutador_posicion}</div>
                                            <div class="recruiter-company">{empresa}</div>
                                        </div>
                                    </div>
                                    <div class="recruiter-contact">
                                        <div class="contact-item">
                                            <span class="material-icons">phone</span>
                                            <span class="contact-text">{reclutador_telefono}</span>
                                        </div>
                                        <div class="contact-item">
                                            <span class="material-icons">email</span>
                                            <span class="contact-text">{reclutador_email}</span>
                                        </div>
                                        <div class="contact-item">
                                            <span class="material-icons">link</span>
                                            <a href={reclutador_red} class="contact-text linkedin-link" target="_blank">
                                                {reclutador_red}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="button-secondary" onClick={(e) => {
                        añadir_recluiter()
                    }}>
                        Añadir Recruiter
                    </button>
                    {reclutadores.length > 0 && <div class="preview-recruiter-card">
                                <h3>Recluiters</h3>
                                {
                                    reclutadores.map( (el, index) => {
                                        
                                        return (<div key={index} class="recruiter-preview">
                                    <div class="recruiter-preview-header">
                                        <div class="recruiter-avatar">
                                            {el.logo ? <img src={el.logo} alt="Avatar de Ana García"/> : <img src="https://i.pravatar.cc/64" alt="Imagen de prueba"/>}
                                        </div>
                                        <div class="recruiter-info">
                                            <div class="recruiter-name">{el.reclutador_nombre}</div>
                                            <div class="recruiter-position">{el.reclutador_posicion}</div>
                                            <div class="recruiter-company">{el.empresa}</div>
                                        </div>
                                    </div>
                                    <div class="recruiter-contact">
                                        <div class="contact-item">
                                            <span class="material-icons">phone</span>
                                            <span class="contact-text">{el.reclutador_telefono}</span>
                                        </div>
                                        <div class="contact-item">
                                            <span class="material-icons">email</span>
                                            <span class="contact-text">{el.reclutador_email}</span>
                                        </div>
                                        <div class="contact-item">
                                            <span class="material-icons">link</span>
                                            <a href={el.reclutador_red} class="contact-text linkedin-link" target="_blank">
                                                {el.reclutador_red}
                                            </a>
                                        </div>
                                    </div>
                                </div>    )   
                                    })
                                }
                    </div>}
                </div>
                <div class="divider"></div>
                <button type="submit" class="button-primary">Guardar Cambios</button>
            </form>
        </div>
        </div>)
        }
        {
            step == 1 && <div className="container" style={{textAlign: "center"}}>
                
                <h1 class="header-title" style={{color: "#1976d2"}}>Registro completado</h1>
                <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 8 }}>
                <p>Pasos a seguir:</p>
                    <p>Te enviaremos un Mail para confirmar el alta de tu empresa</p>
                    <p>Un administrador dará de alta tu cuenta</p>
                    <p>¡Listo! ya estarás listo para iniciar a usar Sparring</p>
                    <button onClick={(e) => {router.push('/')}} style={{marginTop:"2%"}} class="button-primary">Ir al login</button>
                </Paper>
            </div>
        }
        </>
    )
}

export default Altas_empresas