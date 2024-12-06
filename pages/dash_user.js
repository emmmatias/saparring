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

function extraerTextos(texto) {
    const regex = /@([^@]+)@/g;
    const textoArray = [];
    let coincidencia;
  
    while ((coincidencia = regex.exec(texto))) {
      textoArray.push(coincidencia[1].trim());
    }
  
    return textoArray;
  }

const Dash_user = () => {
    const [prueba, setPrueba] = useState(null)
    const [Page, setPage] = useState('home')
    const [step, setStape] = useState(1)
    const [prueba_id, setPrueba_id] = useState()
    const [prueba_id_ingresado, setPrueba_id_ingresado] = useState('')
    const [preguntas, setPreguntas] = useState()
    const [respuestas, setRespuestas] = useState([])
    const [respuesta_M, setrespuesta_M] = useState([])
    const [prueba_finalizada, setPrueba_finalizada] = useState(false)
    const [texto, setTexto] = useState(true)
    const [textinput, setTextinput] = useState('')
    const [current_cuestion, setCurrent_cuestion] = useState(0)
    const [cc, setCc] = useState(current_cuestion + 1)
    const [config, setConfig] = useState() 
    const [grabando, setGrabando] = useState(false)
    const [time, setTime] = useState()
    const [aceptado, setAceptado] = useState(false)
    const [Waiting, setWaiting] = useState(false)
    let [feedback, setfeedback] = useState(false)
    const [max_preguntas, set_max_preguntas] = useState()
    const [total_cuestion, set_total_cuestion] = useState()
    const [mail_candidato, setMail_candidato] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const router = useRouter()

    const verificarCuenta = async () => {
        console.log('verificarCuenta')
        let response = await fetch('/api/verificarTokenUser',{
            method:'POST'
        })
        if(response.ok){
            let data = await response.json()
            login(data.mail, 'candidato')
            console.log('verificarCuenta', 'response.ok')
        }else{
            router.push('/index')
        }
    }

    useEffect(() => {
        obtener_datos_de_prueba(prueba_id)
    }, [prueba_id])

    useEffect(() => {
        verificarCuenta()
    },[])

    const closeModal = () => {
        setIsOpen(false);
        setVideoBlob(null);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const startRecording = async () => {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);

        mediaRecorderRef.current.ondataavailable = (event) => {
            setVideoBlob(event.data);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        videoRef.current.srcObject = streamRef.current; // Muestra el video en el modal
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };


    const openModal = () => {
        setIsOpen(true);
    };


    useEffect(() => {
        
        obtener_datos_de_prueba(prueba_id_ingresado)
    },[prueba_id_ingresado])

    useEffect(() => {
        //obtener pruebas para mail determinado solo las que no fueron constestadas
        
    },[])


    useEffect(() => {
        console.log('cambio en isOpen', isOpen)
    }, [isOpen])

    //const prueba_id = router.query.prueba_id ? router.query.prueba_id : null

    const obtener_datos_de_prueba = async (prueba_id) => {
        let response = await fetch(`/api/obtener_prueba?id=${prueba_id}`)
        if(response.ok){
            let data = await response.json()
            setPrueba(data)
            let max = JSON.parse(data.respuesta.preguntas)
            setPreguntas(max.preguntas_generadas)
            set_max_preguntas(max.preguntas_generadas.length)
            let oc = JSON.parse(data.respuesta.config)
            console.log('los datos de la config son ', oc)
            setConfig(oc)
            console.log('las respuestas previas son :', respuestas.length, 'y las reguntas máximas son :', max.preguntas_generadas.length)
            console.log('La data procesada es', data)
        }else{
            alert('id de prueba inválido')
        }
    }

    function segundosDesdeFecha(fechaInput) {
        // Convertir la fecha proporcionada a un objeto Date
        const fechaObjetos = new Date(fechaInput);
    
        // Verificar si la fecha es válida
        if (isNaN(fechaObjetos.getTime())) {
            throw new Error("Fecha inválida");
        }
    
        // Obtener la fecha y hora actual
        const fechaActual = new Date();
    
        // Calcular la diferencia en milisegundos
        const diferenciaMilisegundos = fechaActual - fechaObjetos;
    
        // Convertir la diferencia a segundos
        const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);
    
        return diferenciaSegundos;
    }

    const iniciar_test = async () => {
        setStape(2)
        console.log('la prueba es ', prueba, 'de tipo', typeof(prueba))
        let response = await fetch('/api/iniciar_test', {
            method: 'POST',
            body: JSON.stringify({
                mail_candidato,
                id_prueba : prueba_id,
                config: JSON.parse(prueba.respuesta.config)
            })
        })
        if(response.ok){
            console.log('DENTRO DEL RESPONSE DE INICIAR TEST')
            let data = await response.json()
            let respuestas_previas
            data.respuestas[0] ? respuestas_previas = extraerTextos(data.respuestas[0]) : respuestas_previas = []
            console.log('respuestas_previas ',respuestas_previas)
            setCurrent_cuestion(respuestas_previas.length)
            setRespuestas(respuestas_previas)
            console.log('la pegunta actual es la n', respuestas_previas.length , 'el el maximo de preguntas es', max_preguntas)
            respuestas_previas.length == max_preguntas ? setStape(3) : feedback == false
            let inicio_anterior = 0
            data.inicio ? inicio_anterior = new Date(data.inicio) : inicio_anterior = 0
            let fecha_actual = new Date()
            if(inicio_anterior){
                console.log('transcurriedon', segundosDesdeFecha(inicio_anterior), ' de ', `${config.time * 60} segundos de tiempo` )
                if(segundosDesdeFecha(inicio_anterior) >= Math.floor(config.time * 60)){
                    alert('tiempo agotado redirijir al feedback')
                    setStape(3)
                }else{
                    setTime((config.time * 60) - (segundosDesdeFecha(inicio_anterior)))
                    console.log('el tiempo es', config.time, 'y es de tipo', typeof(config.time))
                }
            }
            if(!inicio_anterior){
                setTime(config.time * 60)
                console.log('el tiempo es', config.time, 'y es de tipo', typeof(config.time))
            }
        }
    }

    useEffect(() => {
        // Verificar si el contador ha llegado a cero
        if (time <= 0){
            finalizar()
            return
        }
        // Establecer un interval para restar un segundo cada 1000 ms
        const intervalId = setInterval(() => {
            setTime(prevSegundos => prevSegundos - 1);
        }, 1000);
        // Limpiar el intervalo al desmontar el componente o cuando cambie el estado
        return () => clearInterval(intervalId);
    }, [time]);

    const time_formathed = (val) => {
    if(val > 0){
        const horas = Math.floor(val / 3600);
        const minutosRestantes = Math.floor((val % 3600) / 60);
        const segundosRestantes = val % 60;
        return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }else{
        return 'Tiempo finalizado'
    }
    }

    const handleChange = (opcion) => {
        if(respuesta_M.includes(opcion)){
            console.log('previo')
            setrespuesta_M((prev) => prev.filter(el => el != opcion))
        }else{
            console.log('no previo')
            setrespuesta_M((prev) => [opcion])
        }
      }

    const handleChangeinput = (value) => {
        setTextinput(value)
    }

    useEffect(() =>{
        console.log(Page)
    },[Page])

    useEffect(() => {
        prueba_id ? obtener_datos_de_prueba(prueba_id) : null
        console.log('prueba_id', prueba_id)
    }, [prueba_id])

    useEffect(() => {
        console.log('respuestaM', respuesta_M)
    }, [respuesta_M])

    useEffect(() => {
        setCc(current_cuestion + 1)
        
    }, [current_cuestion])

    const sumar1 = () => {
        setCurrent_cuestion(current_cuestion + 1)
    }

    const handleUpload = async () => {
        if (!videoBlob) return;

        const formData = new FormData();
        formData.append('file', videoBlob, 'video.webm')
        

        try {
            const evaluationResult = await sendToApi(formData);
            setEvaluation(evaluationResult);
        } catch (error) {
            console.error('Error:', error);
        }

        closeModal(); // Cierra el modal después de subir
        setTexto(true)
    };

    const sendToApi = async (formData) => {
        const response = await fetch('/api/video', { // Cambia a tu ruta API
            method: 'POST',
            body: formData,
        });
        if(response.ok){
            closeModal()
            let data = await response.json()
            guardar_respuesta(data.texto)
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
    };

    const finalizar = async (textinput) => {
        console.log('PRUEBA FINALIZADAAAAAAA')
        setStape(3)
        if(textinput){
            try{
                setWaiting(true)
                await guardar_respuesta(textinput)
                let obj = {
                    max_preguntas,
                        preguntas,
                        interviewType: config.interviewType,
                        level: config.interviewLevel,
                        tecnologies: config.selectedTechnologies,
                        interviewType: config.interviewType,
                        prueba_id,
                        mail_candidato,
                        termino: new Date()
                }

                console.log('objeto en feedback', obj)
                let response = await fetch('/api/feedback2', {
                    method:'POST',
                    body: JSON.stringify({
                        max_preguntas,
                        preguntas,
                        interviewType: config.interviewType,
                        level: config.interviewLevel,
                        tecnologies: config.selectedTechnologies,
                        interviewType: config.interviewType,
                        prueba_id,
                        mail_candidato,
                        termino: new Date()
                    })
                })
                if(response.ok){    
                    let data = await response.json()
                    setfeedback(data)
                }
                //setPrueba_finalizada(true)
            }catch(error){
                console.error
                setWaiting(false)
            }finally{
                setWaiting(false)
            }
        }else{

        }
    }

    const aceptaterminos = (checked) => {
        if(checked){
            setAceptado(true)
        }
    }

    const modalStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        borderRadius: '8px',
    };

    const guardar_respuesta = async (res) => {
        console.log('guardando respuestas')
        setRespuestas([...respuestas , res])
        setrespuesta_M([])
        setTextinput('')
        sumar1()
        let response = await fetch('/api/guardar_progreso', {
            method:'POST',
            body: JSON.stringify({
                respuestas: [...respuestas , res],
                prueba_id,
                mail_candidato
            })
        })
        if(response.ok){
            console.log('registro actualizado')
        }
    }

    useEffect(() => {
        console.log('las preguntas maximas son: ', max_preguntas)
        console.log('las pregunta actual es : ', cc)
        
    },[max_preguntas, cc, respuestas])

    let estiloi = {color: "#3273dc"}

    return(
        <>
        <h1 class="title has-text-centered mt-4">Área de Candidato</h1>
        <div class="tabs is-centered">
            <ul>
                <li><a onClick={(e) => {router.push('/registro_candidato')}}>Mi perfil</a></li>
                <li><a onClick={(e) => {setPage('sparring')}}>Mi prueba</a></li>
                <li><a disabled={!feedback} onClick={(e) => {setPage('feedback')}}>Mi feedback</a></li>
                <li><a>Mi contacto</a></li>
            </ul>
        </div>

        {
            Page == 'sparrig' && (
            <div>
            {/* PRUEBA INICIALIADA */}
            {
                (prueba_id && prueba) && (
                    <>
            {
            step == 1 && <section class="section">
             <div class="container">
            <h1 class="title has-text-centered">Descripción de la Prueba Técnica</h1>
            <h2 class="subtitle has-text-centered">Bienvenido, <span id="candidate-name">{config.candidato}</span></h2>
            <div class="columns is-variable is-8">
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <p class="title is-4">Explicación de la Prueba</p>
                            <div class="content">
                                {
                                    config.contraseña.mensajes.descripción_prueba ? <p>{`${config.contraseña.mensajes.descripción_prueba}`}</p> : <p>{`Esta prueba técnica ha sido diseñada meticulosamente para evaluar tus habilidades y conocimientos en ${config.interviewType}. Durante los proximos ${config.time ? `${config.time} minutos` : '30 minutos'}, te enfrentarás a una serie de desafíos que abarcan diversos aspectos del desarrollo de software moderno.`}<strong>{` Contará con preguntas de tipo test, preguntas de desarrollo, retos de realización de código y/o discusión de código.`}</strong></p> 
                                }
                                <p>Consejos para realizar la prueba:</p>
                                <ul>
                                    <li>Lee cuidadosamente cada pregunta antes de comenzar.</li>
                                    <li>Gestiona tu tiempo de manera eficiente, no te quedes atascado en una sola pregunta.</li>
                                    <li>Comenta tu código para explicar tu razonamiento.</li>
                                    <li>Si no puedes completar una tarea, explica tu enfoque y los pasos que seguirías.</li>
                                </ul>
                                
                                <p>Recuerda, esta prueba no solo evalúa tus habilidades técnicas, sino también tu capacidad para trabajar bajo presión y resolver problemas de manera creativa. ¡Buena suerte!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <p class="title is-4">Resumen de la Prueba</p>
                            <div class="content">
                                <p><strong>Empresa:</strong> <span id="company-name">{`${config.empresa}`}</span></p>
                                {config.contraseña.mensajes.descripción_empresa ? <p>{`${config.contraseña.mensajes.descripción_empresa}`}</p> : null}
                                <p><strong>Categoría:</strong> <span id="test-category">{config.interviewrole}</span></p>
                                <p><strong>Nivel:</strong> <span id="test-level">{`${config.interviewLevel}`}</span></p>
                                <p><strong>Tecnologías:</strong></p>
                                <ul id="test-technologies">
                                    {
                                        config.selectedTechnologies.map((el, index) => <li key={index}>{el}</li>)
                                    }
                                </ul>
                                <p><strong>Duración Límite:</strong> <span id="test-duration">{config.time ? `${config.time} minutos` : '30 minutos'}</span></p>
                                
                                <div class="message">
                                    <div class="message-body">
                                        {config.contraseña.manesajes.reclutador && <p><strong>{config.contraseña.manesajes.reclutador}</strong></p>}
                                        <p>{config.contraseña.manesajes.mensaje_personal}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="start-button has-text-centered">
                <h6>Ingresa tu email</h6>
                <TextField
                    fullWidth
                     sx={{width:'40%'}}
                    variant="outlined"
                    label="Ingresa tu email"
                    placeholder="Tu evaluación"
                    value={mail_candidato}
                    onChange={(e) => {setMail_candidato(e.target.value)}}
                    /><br/>
                <label class="checkbox">
                    <input type="checkbox" checked={aceptado} value={aceptado} onChange={(e) => {setAceptado(true)}} id="accept-conditions"/>
                    Acepto las <a href="#" target="_blank">condiciones de la prueba técnica</a>
                </label>
                <br/><br/>
                <button onClick={(e) => {iniciar_test()}} class="button is-primary is-large" id="start-test" disabled={((mail_candidato.length == 0 || aceptado == false))}>Empezar Prueba</button>
            </div>
            </div>
            </section>
            }

        { step != 1 && <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 4 }}>
        <section class="section">
            <div class="container">
                <h1 class="title is-2 has-text-centered">Prueba Técnica para {config.interviewrole}</h1>
                {(time && !feedback) && <div class="notification is-light has-text-centered mt-5" id="countdown-timer">
                    <span class="timer-label">Tiempo restante: </span>
                    <span id="timer-value">{time ? time_formathed(time): ''}</span>
                </div>}
                <div id="test-container">
                </div>
            </div>
        </section>
            {
                step == 2 && (
                    <Grid2 container spacing={2}>
                        
                        <Grid2 item xs={12} md={8}>
                                <>
                                {
                                   (preguntas[current_cuestion].tipo == 'Pruebas Tipo Test' && (
                                        <div>
                                            <p>Selecciona una opción</p>
                                            <p>{preguntas[current_cuestion].pregunta}</p>
                                            {preguntas[current_cuestion].opciones.map((option, index) => {
                                                return(<div key={index}><label>
                                                    <input
                                                      type="radio"
                                                      name={`${option}`}
                                                      value={option}
                                                      checked={respuesta_M.includes(option)}
                                                      onClick={(e) => handleChange(e.target.value)}
                                                    />
                                                    {option}
                                                  </label><br/></div>)
                                            })}
                                            {(max_preguntas != cc) && <Button  onClick={(e) => {guardar_respuesta(respuesta_M[0])}}>Guardar Respuesta</Button>}
                                            { (max_preguntas == cc) && <Button  onClick={(e) => {setStape(3); finalizar(respuesta_M[0])}}>Finalizar</Button>}
                                        </div>
                                    ))
                                }
                                {
                                    (preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && <><p>Lee el siguiente enunciado y contesta</p>
                                    {(preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && (
                                        <div>
                                            <code>{preguntas[current_cuestion].pregunta}</code>
                                            {texto ? (<TextField
                                                fullWidth
                                                multiline
                                                variant="outlined"
                                                label="Desarrolla"
                                                placeholder="Tu evaluación"
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                            />) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                                <div style={modalStyles}>
                                                    <h2>Grabación de Video</h2>
                                                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
                                                    <div>
                                                        {isRecording ? (
                                                            <button onClick={stopRecording}>Detener Grabación</button>
                                                        ) : (
                                                            <button onClick={startRecording}>Iniciar Grabación</button>
                                                        )}
                                                    </div>
                                                    {videoBlob && (
                                                        <div>
                                                            <button onClick={handleUpload}>Enviar respuesta</button>
                                                        </div>
                                                    )}
                                                    <button onClick={(e) => {closeModal; setTexto(false)}}>Cerrar</button>
                                                </div>
                                            )}
                                        </div>}
                                            {texto ? <Button onClick={(e) => {(e) => openModal(); setTexto(false)}}>Grabar video</Button> : <Button>Escribir texto</Button>}
                                            {(max_preguntas != cc) && <Button  onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                            {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                        </div>
                                    ))}
                                    </>)
                                }
                                {
                                    (preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && <><p>Evalúa el siguiente código</p>
                                    {(preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && (
                                        <div>
                                            <code>{preguntas[current_cuestion].pregunta}</code>
                                            <TextField
                                                fullWidth
                                                multiline
                                                variant="outlined"
                                                label="Evalua el código anterior"
                                                placeholder="Tu evaluación"
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                            />
                                            {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                            { (max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                        </div>
                                    ))}</>)
                                }
                                {
                                    ( preguntas[current_cuestion].tipo == 'Desarrollo de Código' &&  <><p>Desarrolla un código según el siguiente enunciado</p>
                                    {(preguntas[current_cuestion].tipo == 'Desarrollo de Código' && (
                                        <div>
                                            <p>{preguntas[current_cuestion].pregunta}</p>
                                             <TextField
                                                fullWidth
                                                multiline
                                                variant="outlined"
                                                label="Tu código"
                                                placeholder="Escribe tu Código"
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                            />
                                             {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                             {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                        </div>
                                    ))}</>)
                                }
                                {
                                    ( preguntas[current_cuestion].tipo == 'Corrección de Errores' && <><p>Corrige los errores del código</p>
                                    {(preguntas[current_cuestion].tipo == 'Corrección de Errores' && (
                                        <div>
                                            <code>{preguntas[current_cuestion].pregunta}</code>
                                             <TextField
                                                fullWidth
                                                multiline
                                                variant="outlined"
                                                label="Tu evaluación"
                                                placeholder="escribe tu evaluación de código"
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                            />
                                             { (max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                             { (max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                        </div>
                                    ))}</>)
                                }
                                {
                                   ( preguntas[current_cuestion].tipo == 'Completar Código' &&  <><p>Evalua el siguiente código y completalo</p>
                                   {(preguntas[current_cuestion].tipo == 'Completar Código' && (
                                        <div>
                                            <code>{preguntas[current_cuestion].pregunta}</code>
                                             <TextField
                                                fullWidth
                                                multiline
                                                variant="outlined"
                                                label="Tu evaluación"
                                                placeholder="escribe tu evaluación de código"
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                            />
                                             {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                             {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                        </div>
                                    ))}</>)
                                }
                                </>
                        </Grid2>
                    </Grid2>
                )
            }
        </Paper>}
        {
                (step == 3 && feedback) && (
                    <section class="section">
            <div class="container">
                <h1 class="title is-2 has-text-centered">Resultados de la Prueba Técnica</h1>
                
                <div class="columns">
                    <div class="column is-8">
                        <div class="test-info">
                            <h2 class="title is-4">Información de la Prueba</h2>
                            <p><strong>ID de la Prueba:</strong> <span id="test-id">{prueba_id}</span></p>
                            <p><strong>Posición:</strong> <span id="test-position">{config.interviewrole}</span></p>
                            <p>
                                <strong>Puntuación global:</strong> {`${feedback.puntuación} %`}
                                <span class="icon is-small has-tooltip-multiline" data-tooltip="Puntuación media ponderada en base a todas las entrevistas técnicas realizadas en la empresa">
                                    <i class="fas fa-info-circle" style={estiloi}></i>
                                </span>
                            </p>
                        </div>
                        
                    </div>
                    <div class="column is-4">
                        <div class="box company-info">
                            <h2 class="title is-4">Información de la Empresa</h2>
                            <p><strong>Nombre:</strong>{config.empresa}</p>
                            <p><strong>Descripción:</strong>{config.descripción_empresa}</p>
                            <p><strong>Contacto Recruitment:</strong> <a href={config.mailto}>{config.mailto}</a></p>
                            <p><strong>Sitio web:</strong> <a href={config.web} target="_blank">{config.web}</a></p>
                        </div>
                        
                        <div class="box next-steps mt-4">
                            <h2 class="title is-4">Siguientes pasos</h2>
                            <div class="is-flex is-align-items-center mb-3">
                                <i class="fas fa-user-circle fa-3x mr-3" style={estiloi}></i>
                                <div>
                                    <p><strong>{config.reclutador}</strong>{config.reclutador_puesto}</p>
                                </div>
                            </div>
                            <p>
                                {config.message_next_step}
                            </p>
                            <p class="mt-3">
                                <strong>{`Si tienes alguna duda, puedes contactar a ${config.reclutador}: `}</strong><br/>
                                <i class="fas fa-phone"></i> <a href="tel:+34612345678">{config.reclutador_numero}</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="feedback-section">
                    <h2 class="title is-3">Resumen</h2>
                    <div class="feedback-content">
                        <p>
                            <i class="fas fa-user-circle"/> {`Estimado ${config.candidato},`}
                        </p>
                        <p>
                            <i class="fas fa-check-circle"/> {`Gracias por completar nuestra prueba técnica para la posición de ${config.interviewType}. Hemos revisado cuidadosamente tus respuestas y nos complace proporcionarte el siguiente feedback: `}
                        </p>
                        {feedback.puntosfuertes && <div class="feedback-highlight">
                            <p><strong><i class="fas fa-star"/> Puntos fuertes:</strong></p>
                            <ul>
                                {feedback.puntosfuertes.map((el, index) => <li key={index}><i class="fas fa-check"/>{el}</li>)}
                            </ul>
                        </div>}
                        {feedback.puntosdebiles && <div class="feedback-highlight">
                            <p><strong><i class="fas fa-bullseye"/> Áreas de mejora:</strong></p>
                            <ul>
                                {feedback.puntosdebiles.map((el, index) => <li key={index}><i class="fas fa-arrow-up"/>{el}</li>)}
                            </ul>
                        </div>}
                        <div class="feedback-explanation">
                            <p>
                                <i class="fas fa-lightbulb"/> Queremos enfatizar que identificar áreas de mejora es una parte natural y valiosa del proceso de crecimiento profesional. Cada desarrollador tiene su propio camino de aprendizaje y evolución, y estas áreas representan emocionantes oportunidades para expandir tus habilidades.
                            </p>
                            {feedback.comentarioinspiracional && <p>
                                <i class="fas fa-rocket"/> {feedback.comentarioinspiracional}
                            </p>}
                            {feedback.comentario && <p>
                                <i class="fas fa-graduation-cap"/> {feedback.comentario}
                            </p>}
                        </div>
                        { feedback.comentariosobrerespuestas && <p>
                            <i class="fas fa-thumbs-up"/> {feedback.comentariosobrerespuestas}
                        </p>}
                        <p>
                            <i class="fas fa-phone"/> Nos pondremos en contacto contigo pronto para discutir los siguientes pasos en el proceso de selección. Estamos emocionados por la posibilidad de explorar cómo tu talento y experiencia pueden contribuir al éxito de nuestro equipo.
                        </p>
                        <p>
                            <i class="fas fa-question-circle"/> Si tienes alguna pregunta o necesitas aclaraciones sobre este feedback, no dudes en contactarnos. Estamos aquí para apoyarte en tu desarrollo profesional.
                        </p>
                        <p>
                            <i class="fas fa-heart" /> ¡Gracias de nuevo por tu tiempo y dedicación!
                        </p>
                    </div>
                </div>

                <div class="field is-grouped is-grouped-centered mt-6">
                    <div class="control">
                        <button class="button is-large is-primary" id="guardar-pdf-btn">Descargar PDF</button>
                    </div>
                </div>
            </div>
                    </section>
                )}</>)}
                {prueba_id == undefined && (
                    <div>
                        <h2>No hemos podido encontrar el id de tu prueba</h2>
                        <h4>Debes de ingresarlo para poder iniciar el sparring</h4>
                        <input value={prueba_id_ingresado} onChange={(e) => setPrueba_id_ingresado(e.target.value)} />
                    </div>
                )}
        </div>)}

        {Page == 'trial' && <>
            {((prueba_id && prueba) && (prueba_finalizada == false)) ? (
    <>
        {
        step == 1 && <section class="section">
         <div class="container">
        <h1 class="title has-text-centered">Descripción de la Prueba Técnica</h1>
        <h2 class="subtitle has-text-centered">Bienvenido, <span id="candidate-name">{config.candidato}</span></h2>
        <div class="columns is-variable is-8">
            <div class="column">
                <div class="card">
                    <div class="card-content">
                        <p class="title is-4">Explicación de la Prueba</p>
                        <div class="content">
                            <p>{`Esta prueba técnica ha sido diseñada meticulosamente para evaluar tus habilidades y conocimientos en ${config.interviewType}. Durante los proximos ${config.time ? `${config.time} minutos` : '30 minutos'}, te enfrentarás a una serie de desafíos que abarcan diversos aspectos del desarrollo de software moderno.`}<strong>{` Contará con preguntas de tipo test, preguntas de desarrollo, retos de realización de código y/o discusión de código.`}</strong></p> 
                            <p>Consejos para realizar la prueba:</p>
                            <ul>
                                <li>Lee cuidadosamente cada pregunta antes de comenzar.</li>
                                <li>Gestiona tu tiempo de manera eficiente, no te quedes atascado en una sola pregunta.</li>
                                <li>Comenta tu código para explicar tu razonamiento.</li>
                                <li>Si no puedes completar una tarea, explica tu enfoque y los pasos que seguirías.</li>
                            </ul>
                            
                            <p>Recuerda, esta prueba no solo evalúa tus habilidades técnicas, sino también tu capacidad para trabajar bajo presión y resolver problemas de manera creativa. ¡Buena suerte!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="card-content">
                        <p class="title is-4">Resumen de la Prueba</p>
                        <div class="content">
                            <p><strong>Empresa:</strong> <span id="company-name">{`${config.empresa}`}</span></p>
                            {config.descripción_empresa && <p><strong>Descripción de la empresa:</strong> <span id="company-description">Diverger es una empresa tecnológica que integra IA generativa en equipos de desarrollo de software. Utilizamos nuestra metodología Exponential Programming para crear proyectos sin límites, combinando talento técnico con conocimiento profundo de frameworks.</span></p>}
                            <p><strong>Categoría:</strong> <span id="test-category">{config.interviewrole}</span></p>
                            <p><strong>Nivel:</strong> <span id="test-level">{`${config.interviewLevel}`}</span></p>
                            <p><strong>Tecnologías:</strong></p>
                            <ul id="test-technologies">
                                {
                                    config.selectedTechnologies.map((el, index) => <li key={index}>{el}</li>)
                                }
                            </ul>
                            <p><strong>Duración Límite:</strong> <span id="test-duration">{config.time ? `${config.time} minutos` : '30 minutos'}</span></p>
                            
                            <div class="message">
                                <div class="message-body">
                                    <p><strong>Mensaje de Laura, Recruitment Specialist:</strong></p>
                                    <p>¡Hola Juan! Estoy segura de que lo harás genial en esta prueba. Recuerda, valoramos tu forma de pensar tanto como las soluciones que propones. Si tienes alguna duda durante el proceso, no dudes en contactarme en laura@diverger.com. ¡Mucha suerte!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="start-button has-text-centered">
            <h6>Ingresa tu email</h6>
            <TextField
                fullWidth
                 sx={{width:'40%'}}
                variant="outlined"
                label="Ingresa tu email"
                placeholder="Tu evaluación"
                value={mail_candidato}
                onChange={(e) => {setMail_candidato(e.target.value)}}
                /><br/>
            <label class="checkbox">
                <input type="checkbox" checked={aceptado} value={aceptado} onChange={(e) => {setAceptado(true)}} id="accept-conditions"/>
                Acepto las <a href="#" target="_blank">condiciones de la prueba técnica</a>
            </label>
            <br/><br/>
            <button onClick={(e) => {iniciar_test()}} class="button is-primary is-large" id="start-test" disabled={((mail_candidato.length == 0 || aceptado == false))}>Empezar Prueba</button>
        </div>
        </div>
        </section>
        }

    { step != 1 && <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 4 }}>
    <section class="section">
        <div class="container">
            <h1 class="title is-2 has-text-centered">Prueba Técnica para {config.interviewrole}</h1>
            {(time && !feedback) && <div class="notification is-light has-text-centered mt-5" id="countdown-timer">
                <span class="timer-label">Tiempo restante: </span>
                <span id="timer-value">{time ? time_formathed(time): ''}</span>
            </div>}
            <div id="test-container">
            </div>
        </div>
    </section>
        {
            step == 2 && (
                <Grid2 container spacing={2}>
                    
                    <Grid2 item xs={12} md={8}>
                            <>
                            {
                               (preguntas[current_cuestion].tipo == 'Pruebas Tipo Test' && (
                                    <div>
                                        <p>Selecciona una opción</p>
                                        <p>{preguntas[current_cuestion].pregunta}</p>
                                        {preguntas[current_cuestion].opciones.map((option, index) => {
                                            return(<div key={index}><label>
                                                <input
                                                  type="radio"
                                                  name={`${option}`}
                                                  value={option}
                                                  checked={respuesta_M.includes(option)}
                                                  onClick={(e) => handleChange(e.target.value)}
                                                />
                                                {option}
                                              </label><br/></div>)
                                        })}
                                        {(max_preguntas != cc) && <Button  onClick={(e) => {guardar_respuesta(respuesta_M[0])}}>Guardar Respuesta</Button>}
                                        { (max_preguntas == cc) && <Button  onClick={(e) => {setStape(3); finalizar(respuesta_M[0])}}>Finalizar</Button>}
                                    </div>
                                ))
                            }
                            {
                                (preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && <><p>Lee el siguiente enunciado y contesta</p>
                                {(preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && (
                                    <div>
                                        <code>{preguntas[current_cuestion].pregunta}</code>
                                        {texto ? (<TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Desarrolla"
                                            placeholder="Tu evaluación"
                                            value={textinput}
                                            onChange={(e) => {handleChangeinput(e.target.value)}}
                                        />) : <div>
                                            {/*grabador de video*/}
                                        <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                        {isOpen && (
                                            <div style={modalStyles}>
                                                <h2>Grabación de Video</h2>
                                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
                                                <div>
                                                    {isRecording ? (
                                                        <button onClick={stopRecording}>Detener Grabación</button>
                                                    ) : (
                                                        <button onClick={startRecording}>Iniciar Grabación</button>
                                                    )}
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {closeModal; setTexto(false)}}>Cerrar</button>
                                            </div>
                                        )}
                                    </div>}
                                        {texto ? <Button onClick={(e) => {(e) => openModal(); setTexto(false)}}>Grabar video</Button> : <Button>Escribir texto</Button>}
                                        {(max_preguntas != cc) && <Button  onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                        {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                    </div>
                                ))}
                                </>)
                            }
                            {
                                (preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && <><p>Evalúa el siguiente código</p>
                                {(preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && (
                                    <div>
                                        <code>{preguntas[current_cuestion].pregunta}</code>
                                        <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Evalua el código anterior"
                                            placeholder="Tu evaluación"
                                            value={textinput}
                                            onChange={(e) => {handleChangeinput(e.target.value)}}
                                        />
                                        {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                        { (max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                    </div>
                                ))}</>)
                            }
                            {
                                ( preguntas[current_cuestion].tipo == 'Desarrollo de Código' &&  <><p>Desarrolla un código según el siguiente enunciado</p>
                                {(preguntas[current_cuestion].tipo == 'Desarrollo de Código' && (
                                    <div>
                                        <p>{preguntas[current_cuestion].pregunta}</p>
                                         <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Tu código"
                                            placeholder="Escribe tu Código"
                                            value={textinput}
                                            onChange={(e) => {handleChangeinput(e.target.value)}}
                                        />
                                         {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                         {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                    </div>
                                ))}</>)
                            }
                            {
                                ( preguntas[current_cuestion].tipo == 'Corrección de Errores' && <><p>Corrige los errores del código</p>
                                {(preguntas[current_cuestion].tipo == 'Corrección de Errores' && (
                                    <div>
                                        <code>{preguntas[current_cuestion].pregunta}</code>
                                         <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Tu evaluación"
                                            placeholder="escribe tu evaluación de código"
                                            value={textinput}
                                            onChange={(e) => {handleChangeinput(e.target.value)}}
                                        />
                                         { (max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                         { (max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                    </div>
                                ))}</>)
                            }
                            {
                               ( preguntas[current_cuestion].tipo == 'Completar Código' &&  <><p>Evalua el siguiente código y completalo</p>
                               {(preguntas[current_cuestion].tipo == 'Completar Código' && (
                                    <div>
                                        <code>{preguntas[current_cuestion].pregunta}</code>
                                         <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Tu evaluación"
                                            placeholder="escribe tu evaluación de código"
                                            value={textinput}
                                            onChange={(e) => {handleChangeinput(e.target.value)}}
                                        />
                                         {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(textinput)}>Guardar Respuesta</Button>}
                                         {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>Finalizar</Button>}
                                    </div>
                                ))}</>)
                            }
                            </>
                    </Grid2>
                </Grid2>
            )
        }
    </Paper>}
    {
            (step == 3 && feedback) && (
                <section class="section">
        <div class="container">
            <h1 class="title is-2 has-text-centered">Resultados de la Prueba Técnica</h1>
            
            <div class="columns">
                <div class="column is-8">
                    <div class="test-info">
                        <h2 class="title is-4">Información de la Prueba</h2>
                        <p><strong>ID de la Prueba:</strong> <span id="test-id">{prueba_id}</span></p>
                        <p><strong>Posición:</strong> <span id="test-position">{config.interviewrole}</span></p>
                        <p>
                            <strong>Puntuación global:</strong> {`${feedback.puntuación} %`}
                            <span class="icon is-small has-tooltip-multiline" data-tooltip="Puntuación media ponderada en base a todas las entrevistas técnicas realizadas en la empresa">
                                <i class="fas fa-info-circle" style={estiloi}></i>
                            </span>
                        </p>
                    </div>
                    
                </div>
                <div class="column is-4">
                    <div class="box company-info">
                        <h2 class="title is-4">Información de la Empresa</h2>
                        <p><strong>Nombre:</strong>{config.empresa}</p>
                        <p><strong>Descripción:</strong>{config.descripción_empresa}</p>
                        <p><strong>Contacto Recruitment:</strong> <a href={config.mailto}>{config.mailto}</a></p>
                        <p><strong>Sitio web:</strong> <a href={config.web} target="_blank">{config.web}</a></p>
                    </div>
                    
                    <div class="box next-steps mt-4">
                        <h2 class="title is-4">Siguientes pasos</h2>
                        <div class="is-flex is-align-items-center mb-3">
                            <i class="fas fa-user-circle fa-3x mr-3" style={estiloi}></i>
                            <div>
                                <p><strong>{config.reclutador}</strong>{config.reclutador_puesto}</p>
                            </div>
                        </div>
                        <p>
                            {config.message_next_step}
                        </p>
                        <p class="mt-3">
                            <strong>{`Si tienes alguna duda, puedes contactar a ${config.reclutador}: `}</strong><br/>
                            <i class="fas fa-phone"></i> <a href="tel:+34612345678">{config.reclutador_numero}</a>
                        </p>
                    </div>
                </div>
            </div>

            <div class="feedback-section">
                <h2 class="title is-3">Resumen</h2>
                <div class="feedback-content">
                    <p>
                        <i class="fas fa-user-circle"/> {`Estimado ${config.candidato},`}
                    </p>
                    <p>
                        <i class="fas fa-check-circle"/> {`Gracias por completar nuestra prueba técnica para la posición de ${config.interviewType}. Hemos revisado cuidadosamente tus respuestas y nos complace proporcionarte el siguiente feedback: `}
                    </p>
                    {feedback.puntosfuertes && <div class="feedback-highlight">
                        <p><strong><i class="fas fa-star"/> Puntos fuertes:</strong></p>
                        <ul>
                            {feedback.puntosfuertes.map((el, index) => <li key={index}><i class="fas fa-check"/>{el}</li>)}
                        </ul>
                    </div>}
                    {feedback.puntosdebiles && <div class="feedback-highlight">
                        <p><strong><i class="fas fa-bullseye"/> Áreas de mejora:</strong></p>
                        <ul>
                            {feedback.puntosdebiles.map((el, index) => <li key={index}><i class="fas fa-arrow-up"/>{el}</li>)}
                        </ul>
                    </div>}
                    <div class="feedback-explanation">
                        <p>
                            <i class="fas fa-lightbulb"/> Queremos enfatizar que identificar áreas de mejora es una parte natural y valiosa del proceso de crecimiento profesional. Cada desarrollador tiene su propio camino de aprendizaje y evolución, y estas áreas representan emocionantes oportunidades para expandir tus habilidades.
                        </p>
                        {feedback.comentarioinspiracional && <p>
                            <i class="fas fa-rocket"/> {feedback.comentarioinspiracional}
                        </p>}
                        {feedback.comentario && <p>
                            <i class="fas fa-graduation-cap"/> {feedback.comentario}
                        </p>}
                    </div>
                    { feedback.comentariosobrerespuestas && <p>
                        <i class="fas fa-thumbs-up"/> {feedback.comentariosobrerespuestas}
                    </p>}
                    <p>
                        <i class="fas fa-phone"/> Nos pondremos en contacto contigo pronto para discutir los siguientes pasos en el proceso de selección. Estamos emocionados por la posibilidad de explorar cómo tu talento y experiencia pueden contribuir al éxito de nuestro equipo.
                    </p>
                    <p>
                        <i class="fas fa-question-circle"/> Si tienes alguna pregunta o necesitas aclaraciones sobre este feedback, no dudes en contactarnos. Estamos aquí para apoyarte en tu desarrollo profesional.
                    </p>
                    <p>
                        <i class="fas fa-heart" /> ¡Gracias de nuevo por tu tiempo y dedicación!
                    </p>
                </div>
            </div>

            <div class="field is-grouped is-grouped-centered mt-6">
                <div class="control">
                    <button class="button is-large is-primary" id="guardar-pdf-btn">Descargar PDF</button>
                </div>
            </div>
        </div>
                </section>
            )
    }
    </>
    ) : (
    <>
    {(prueba_finalizada == false) && (prueba_id) ? (<>
        { (Page == 'home') && <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 4 }}>
            <div style={{textAlign:'center'}}>
            <h3>Vienvenido al area de candidatos de Sparring.dev</h3>
            <p>Aquí podras realizar tus eveluaciones para acceder a una posición en la que encajes perfectamente</p>
            <p>Si tienes link de prueba puedes ingresar direcatamente desde allí</p>
            <p>Si prefieres puedes ir a la seccion de Mi prueba e ingresar a la misma</p>
            </div>
    </Paper>}</>) : (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '90%', mx: 'auto', mt: 4 }}>
        <Typography sx={{textAlign:'center'}} variant="h5" gutterBottom>
                ¡Prueba finalizada!
        </Typography>
        <center>
        <p>Queremos agradecerte el tiempo de haber utilizado nuestra plataforma. <br/>Si no pudiste completar la prueba no te preocupes todas las respuestas se guardan automáticamente</p>
        <p>Te deseamos mucho éxito en tu camino profesional</p>
        <p>El equipo de Sparring Labs</p>
        </center>
    </Paper>)}</>)}
        </>}
    </>
    )
    
}

export default Dash_user



    
