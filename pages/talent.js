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
    Chip,
    ButtonGroupButtonContext
  } from '@mui/material';
import { useState, useEffect, useRef } from 'react'
import * as cookie from 'cookie'
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";
import { useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import { marked } from 'marked'
//import 'ace-builds/src-noconflict/mode_javascript';
//import 'ace-builds/src-noconflict/theme_monokai';
import '@/components/video.module.css'
import './talent.module.css'


function extraerTextos(texto) {
    const regex = /@([^@]+)@/g;
    const textoArray = [];
    let coincidencia;
  
    while ((coincidencia = regex.exec(texto))) {
      textoArray.push(coincidencia[1].trim());
    }
  
    return textoArray;
  }


const Talent = () => {
    const [prueba, setPrueba] = useState(null)
    const [Page, setPage] = useState('sparring')
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
    const [feedback, setfeedback] = useState(false)
    const [max_preguntas, set_max_preguntas] = useState()
    const [total_cuestion, set_total_cuestion] = useState()
    const [mail_candidato, setMail_candidato] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderAudio = useRef(null)
    const mediaRecorderVideo = useRef(null)
    const [mensajes, setMensajes] = useState()
    const [nombre, setnombre] = useState()
    const [apellido, setapellido] = useState()
    const [puesto, setpuesto] = useState()
    const [tecnologias, settecnologias] = useState()
    const [situacion, setsituacion] = useState()
    const [oferta, setoferta] = useState() 
    const [pruebas, setpruebas] = useState() 
    const [feedbacks,setfeedbacks] = useState()
    const [config2 , setconfig2] = useState()
    const streamRef = useRef(null);
    const [isMediaAvailable, setIsMediaAvailable] = useState({ audio: false, video: false });
    const [mediaBlob, setMediaBlob] = useState(null);
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const router = useRouter()
    const [audioBlob, setAudioBlob] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    const [loaded, setLoaded] = useState(false);

    //*********************** video

    useEffect(() => {
        // Verifica si hay un micrófono y/o cámara disponible
        const checkMediaAvailability = async () => {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMediaAvailable(prevState => ({ ...prevState, audio: true }));
            audioStream.getTracks().forEach(track => track.stop()); // Detenemos el stream inmediatamente
          } catch {
            setIsMediaAvailable(prevState => ({ ...prevState, audio: false }));
          }
    
          try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setIsMediaAvailable(prevState => ({ ...prevState, video: true }));
            videoStream.getTracks().forEach(track => track.stop()); // Detenemos el stream inmediatamente
          } catch {
            setIsMediaAvailable(prevState => ({ ...prevState, video: false }));
          }
        };
    
        checkMediaAvailability();
      }, []);
      
      const stopRecording = () => {
        if (mediaRecorderVideo.current) {
            mediaRecorderVideo.current.stop();
        }
        if (mediaRecorderAudio.current) {
            mediaRecorderAudio.current.stop();
        }
        setIsRecording(false);
    };
    
    const startRecordingAudio = async () => {
        if (audioBlob) {
            setAudioBlob(null);
        }
        if (isMediaAvailable.audio) {
            const constraints = { audio: true }; // Asegúrate de que esto sea correcto
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaRecorderAudio.current = new MediaRecorder(stream);
            const audioChunks = [];
    
            mediaRecorderAudio.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
    
            mediaRecorderAudio.current.onstop = () => {
                if (audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    setAudioBlob(audioBlob);
                }
            };
    
            mediaRecorderAudio.current.start();
            setIsRecording(true);
        }
    };
    
    const startRecordingVideo = async () => {
        if (videoBlob) {
            setVideoBlob(null);
        }
        if (isMediaAvailable.video) {
            const constraints = {
                audio: isMediaAvailable.audio ? true : false, // Asegúrate de que esto sea correcto
                video: true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaRecorderVideo.current = new MediaRecorder(stream);
            const videoChunks = [];
    
            mediaRecorderVideo.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    videoChunks.push(event.data);
                }
            };
    
            mediaRecorderVideo.current.onstop = () => {
                if (videoChunks.length > 0) {
                    const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
                    
                    setVideoBlob(videoBlob);
                }
            };
    
            mediaRecorderVideo.current.start();
            setIsRecording(true);
        }
    };
    
    const startRecording = async () => {
        // Eliminar grabaciones anteriores
        if (audioBlob) {
            setAudioBlob(null);
        }
        if (videoBlob) {
            setVideoBlob(null);
        }
        // Lógica de inicio de grabación
        if (isMediaAvailable.audio && !isMediaAvailable.video) {
            await startRecordingAudio();
        } else if (isMediaAvailable.video) {
            await startRecordingAudio()
            await startRecordingVideo();
        }
    };


      /*
      const startRecordingAudio = async () => {
        if(audioBlob){
            setAudioBlob(null);
        }
        if(isMediaAvailable.audio){
            const constraints = {
                audio: isMediaAvailable.audio,
              }
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              mediaRecorderAudio.current = new MediaRecorder(stream);
              const audioChunks = [];
              mediaRecorderAudio.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data)
                }
              }
              mediaRecorderAudio.current.onstop = () => {
                if (audioChunks.length > 0) {
                  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                  setAudioBlob(audioBlob);
                }
              }
              mediaRecorderAudio.current.start();
              setIsRecording(true);
        }
      }

      const startRecordingVideo = async () => {
        if(videoBlob){
            setVideoBlob(null);
        }
        if(isMediaAvailable.video){
            const constraints = {
                audio: isMediaAvailable.audio,
                video: isMediaAvailable.video
              }
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              mediaRecorderVideo.current = new MediaRecorder(stream);
              const videoChunks = [];
              mediaRecorderVideo.current.ondataavailable = event => {
                if (event.data.size > 0) {
                  if (isMediaAvailable.video) {
                    videoChunks.push(event.data);
                  }
                }
              }
              mediaRecorderVideo.current.onstop = () => {
                if (videoChunks.length > 0) {
                  const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
                  setVideoBlob(videoBlob);
                }
              }
              mediaRecorderVideo.current.start();
              setIsRecording(true);
        }
      }

      const startRecording = async () => {
        
        // Eliminar grabaciones anteriores
        if(audioBlob){
            setAudioBlob(null);
        }
        if(videoBlob){
            setVideoBlob(null);
        }
        if(isMediaAvailable.audio && !isMediaAvailable.video){
            startRecordingAudio()
        }
        if(isMediaAvailable.video){
            stertRecordingVideo()
        }
        /*
        if(isMediaAvailable.audio && !isMediaAvailable.video){
            const constraints = {
                audio: isMediaAvailable.audio,
              }
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              mediaRecorderRef.current = new MediaRecorder(stream);
              const audioChunks = [];
              mediaRecorderRef.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data)
                }
              }
              mediaRecorderRef.current.onstop = () => {
                if (audioChunks.length > 0) {
                  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                  setAudioBlob(audioBlob);
                }
              }
              mediaRecorderRef.current.start();
              setIsRecording(true);
        }*/
        /*
        if(isMediaAvailable.video){
            const constraints = {
                audio: isMediaAvailable.audio,
                video: isMediaAvailable.video
              }
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              mediaRecorderRef.current = new MediaRecorder(stream);
              const audioChunks = [];
              const videoChunks = [];
              mediaRecorderRef.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    if (isMediaAvailable.audio) {
                    audioChunks.push(event.data);
                  }
                  if (isMediaAvailable.video) {
                    videoChunks.push(event.data);
                  }
                }
              }
              mediaRecorderRef.current.onstop = () => {
                if (audioChunks.length > 0) {
                  const audioBlob = new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
                  setAudioBlob(audioBlob);
                }
                if (videoChunks.length > 0) {
                  const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
                  setVideoBlob(videoBlob);
                }
              }
              mediaRecorderRef.current.start();
              setIsRecording(true);
        }*//*
      }
    
      const stopRecording = () => {
        mediaRecorderVideo.current.stop()
        mediaRecorderAudio.current.stop()
        setIsRecording(false);
      };*/


      const handleSubmit = async () => {
        const formData = new FormData();
    
        if (audioBlob) {
            console.log('HAY AUDIOBLOB', audioBlob.type)
          formData.append('file', audioBlob, 'recorded_audio.webm')
          if(videoBlob){
            console.log('HAY videoBLOB!')
          }
        } else {
          alert('Error al enviar: no hay audio grabado.');
          return;
        }
        
        try {
            
          const response = await fetch('/api/video', {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error('Error saving data');
          }
    
          const data = await response.json();
          console.log('subiendo respuestas');
          setTextinput(data.respuesta);
          // Manejar la lógica de respuesta
        } catch (error) {
          console.error('Error during submission:', error);
        }
      };

    //****************** video

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
            setMensajes(oc.contraseña.mensajes)
            console.log('las respuestas previas son :', respuestas.length, 'y las reguntas máximas son :', max.preguntas_generadas.length)
            console.log('La data procesada es', data)

        }else{
            alert('id de prueba inválido')
        }
    }

    const closeModal = () => {
        setIsOpen(false);
        setVideoBlob(null);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        console.log('cambio en isOpen', isOpen)
    }, [isOpen])

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
            router.push('/login')
        }
    }

    useEffect(() => {
        // Verificar si el contador ha llegado a cero
        if (time <= 0){
            console.log('FINALIZAR POR TIEMPO')
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

    useEffect(() => {
        console.log('respuestaM', respuesta_M)
    }, [respuesta_M])

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
            try{
                setWaiting(true)
                if(textinput){
                    await guardar_respuesta(textinput)
                }
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
                console.log(config)
                let response = await fetch('/api/feedback2', {
                    method:'POST',
                    body: JSON.stringify({
                        mail_recluiter: config.recluiter,
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
                }else{
                    let data = await response.json()
                    alert(data.message)
                }
                //setPrueba_finalizada(true)
            }catch(error){
                console.error
                setWaiting(false)
            }finally{
                setWaiting(false)
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

    let estiloi = {color: "#3273dc"}

    useEffect(() => {
        setCc(current_cuestion + 1)
        
    }, [current_cuestion])

    useEffect(() =>{
        console.log('el feeedbak es:', feedback)
        console.log(Page)
    },[Page])

    const obtenerData_candidato = async (mail3) => {
        let response = await fetch(`/api/getCandidate?mail=${mail3}`)
        if(response.ok){
            let data = await response.json()
            setnombre(data.nombre)
            setapellido(data.apellido) 
            setpuesto(data.puesto)
            settecnologias(data.tecnologias)
            setsituacion(data.situacion)
            setoferta(data.oferta)
            setpruebas(data.pruebas)
            setfeedbacks(data.feedbacks) 
            setconfig2(data.config)
            console.log('datos del usuario:', data)
        }
        if(!response.ok){
            alert('No se pudieron rescatar los datos del usuario')
        }
    }

    const calcular_preg_actual = (index) => {
        const tipoBuscado = preguntas[index].tipo;
    
        // Contar total de preguntas del mismo tipo
        const totalCount = preguntas.filter(pregunta => pregunta.tipo === tipoBuscado).length;
    
        // Contar preguntas anteriores del mismo tipo
        const prevPreguntas = preguntas.slice(0, index);
        const prevCount = prevPreguntas.filter(pregunta => pregunta.tipo === tipoBuscado).length;
        

        if(current_cuestion < index){
            return `(${0}/${totalCount})`
        }
        if(current_cuestion == index){
            return `(${prevCount + 1}/${totalCount})`
        }
        if(current_cuestion > index){
            return `(${totalCount}/${totalCount})`
        }

        return `(${prevCount + 1}/${totalCount})`; // +1 para incluir la pregunta actual
      };

    // VERIFICAR SI HAY ENLACE O NO...
    useEffect(() => {
        const url = new URL(window.location.href)
        const params = url.searchParams;
        console.log(params.get('prueba_id'))
        console.log('el mail es:', params.get('mail'))
        if(params.get('prueba_id')){
            console.log('hay id de prueba')
            setPrueba_id(params.get('prueba_id'))
            // verificar sesion previa
            if(params.get('mail')){
                setMail_candidato(params.get('mail'))
                obtenerData_candidato(params.get('mail'))
            }
        }else{
            setPrueba_id(null)
            setPage('sparring')
            //si no está logueado enviar mail de identificacion
        }
    },[])

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
        setPage('sparring')
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
        if(prueba_id){
            console.log('Hay valor en el prueba id')
            obtener_datos_de_prueba(prueba_id)
        }
    },[prueba_id])


    const asd = async () => {
        let res2 = await fetch(`/api/obetenerfeedback?id=${prueba_id}${mail_candidato}`)
            if(res2.ok){
                let data = await res2.json()
                setfeedback(data.respuesta)
                console.log(data.respuesta)
            }
            if(!res2.ok){
                alert('error al finalizar prueba')
            }
    }

    /*useEffect(() => {
        if(step == 3){
            console.log('FINALIZAR POR STEP')
            finalizar()
        }
    }, [step])*/

    useEffect(() => {
        console.log('respuestas', respuestas)
    },[respuestas])


    const progressContainer = {
        position: 'sticky',
        top: '0',
        background: 'white',
        zIndex: 1000, // Cambiado a zIndex en lugar de z-index
        padding: 'calc(var(--spacing-unit) * 2)',
        boxShadow: 'var(--shadow-1)', // Cambiado a boxShadow en lugar de box-shadow
    }
    
    const progressWrapper = {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        padding:'1%',
        justifyContent: 'space-between', // Cambiado a justifyContent en lugar de justify-content
        alignItems: 'center', // Corregido el punto (.)
    }

    const progressBarStyle = {
        display: 'flex',
        gap: 'calc(var(--spacing-unit) * 2)',
        flex: 1,
        marginRight: 'calc(var(--spacing-unit) * 3)',
    };
    
    const progressStepStyle = {
        position: 'relative',
        flex: 1,
    };
    
    const stepCircleStyle = {
        width: '32px',
        height: '32px',
        background: 'grey',
        borderRadius: '50%',
        background: 'var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        transition: 'all 0.3s ease',
    };
    
    return(
        <>
        {!prueba_id && <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div style={{backgroundColor:'white', padding:'5%', borderRadius:'40px'}}>
            <h4 style={{color:'#1976d2'}}>Has ingresado sin enlace de invitación, por favor solicitalo o ingresa el que te han dado</h4>
            <center>
            <input className='search-input2323' value={prueba_id_ingresado} placeholder='Ingresa el id de prueba' style={{display:'block', marginTop:'5%', marginBottom:'5%'}} onChange={(e) => setPrueba_id_ingresado(e.target.value)}/>
            <button className='button-primary' onClick={(e) => {setPrueba_id(prueba_id_ingresado)}}>Ingresar</button>
            </center>
            </div>
            </div>}
        {/* MENU */}
        {
            prueba_id && prueba ? <div>

        {/*<h1 class="title has-text-centered mt-4">Área de Candidato</h1>
        <div class="tabs is-centered">
            <ul>
                <li><a onClick={(e) => {setPage('registro')}}>Mi perfil</a></li>
                <li><a onClick={(e) => {setPage('sparring')}}>Mi prueba</a></li>
                <li><a disabled={!feedback} onClick={(e) => {setPage('feedback')}}>Mi feedback</a></li>
                <li><a>Mi contacto</a></li>
            </ul>
        </div>*/}

        {/* AREA DE REGISTRO DE DATOS */}

        {/* AREA DE PRUEBA */}
            {
                Page == 'sparring' && (
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
                                        {mensajes.descripción_prueba ? `${mensajes.descripción_prueba}` : `Esta prueba técnica ha sido diseñada meticulosamente para evaluar tus habilidades y conocimientos en ${config.interviewType}. Durante los proximos ${config.time ? `${config.time} minutos` : '30 minutos'}, te enfrentarás a una serie de desafíos que abarcan diversos aspectos del desarrollo de software moderno.`}<strong>{` Contará con preguntas de tipo test, preguntas de desarrollo, retos de realización de código y/o discusión de código.`}</strong>
                                        Consejos para realizar la prueba:
                                        <ul>
                                            <li>Lee cuidadosamente cada pregunta antes de comenzar.</li>
                                            <li>Gestiona tu tiempo de manera eficiente, no te quedes atascado en una sola pregunta.</li>
                                            <li>Comenta tu código para explicar tu razonamiento.</li>
                                            <li>Si no puedes completar una tarea, explica tu enfoque y los pasos que seguirías.</li>
                                        </ul>
                                        Recuerda, esta prueba no solo evalúa tus habilidades técnicas, sino también tu capacidad para trabajar bajo presión y resolver problemas de manera creativa. ¡Buena suerte!
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="card">
                                <div class="card-content">
                                    <p class="title is-4">Resumen de la Prueba</p>
                                    <div class="content">
                                    <strong>Empresa:</strong> <span id="company-name">{`${config.empresa}`}</span><br/>
                                        {mensajes.descripción_empresa && <><strong>Descripción de la empresa:<br/>{`${mensajes.descripción_empresa}`}</strong> <span id="company-description">{mensajes.descripción_empresa}</span></>}
                                        <strong>Categoría:</strong> <span id="test-category">{config.interviewrole}</span>
                                        <br/><strong>Nivel:</strong> <span id="test-level">{`${config.interviewLevel}`}</span>
                                        <br/><strong>Tecnologías:</strong>
                                        <ul id="test-technologies">
                                            {
                                                config.selectedTechnologies.map((el, index)=> <li key={index}>{el}</li>)
                                            }
                                        </ul>
                                        <strong>Duración Límite:</strong> <span id="test-duration">{config.time ? `${config.time} minutos` : '30 minutos'}</span>
                                        
                                        <div class="message">
                                            <div class="message-body">
                                                <strong>{mensajes.reclutador ? `${mensajes.reclutador}` : 'Ana Garcia' }, Recruitment Specialist:</strong>
                                                <>{mensajes.mensaje_personal ? <>{`${mensajes.mensaje_personal}`}</> : "¡Hola Juan! Estoy segura de que lo harás genial en esta prueba. Recuerda, valoramos tu forma de pensar tanto como las soluciones que propones. Si tienes alguna duda durante el proceso, no dudes en contactarme en laura@diverger.com. ¡Mucha suerte!"}</>
                                                <>Contacto: {mensajes.contacto_reclutador}</>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="start-button has-text-centered">
                    {!mail_candidato && 
                        <><h6>Ingresa tu email</h6>
                        <TextField
                            fullWidth
                            sx={{width:'40%'}}
                            variant="outlined"
                            label="Ingresa tu email"
                            placeholder="Tu evaluación"
                            value={mail_candidato}
                            onChange={(e) => {setMail_candidato(e.target.value)}}
                            /><br/></>}
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
                    { (step != 1 && step != 3)  && 
                    <div style={{marginLeft: '10%', marginRight:'10%'}}>
            <div style={progressContainer}>
                <div style={progressWrapper}>
                    <div style={progressBarStyle}>
                    {preguntas.map((pregunta, index) => (
                        <div key={index} style={progressStepStyle}>
                        <div style={{stepCircleStyle}} >
                            {index + 1}
                        </div>
                        <div className="step-label">
                            {`${pregunta.tipo} ${calcular_preg_actual(index)}`}
                        </div>
                        {index < preguntas.length - 1 && (
                            <div className="progress-line">
                            <div
                                className="progress-line-fill"
                                style={{
                                width: index < current_cuestion ? '100%' : '0%',
                                }}
                            ></div>
                            </div>
                        )}
                        </div>
                    ))}
                    <div style={{marginTop:'1%'}}>
                        <span class="material-icons timer-icon">timer</span>
                        <span>{time ? time_formathed(time): ''}</span>
                    </div>
                    </div>
                </div>
            </div>
            <div class="test-header">
            <div class="test-header-grid">
                <div class="test-metadata">
                    <div class="test-info-grid">
                        <div class="info-item">
                            <span class="material-icons">fingerprint</span>
                            <div>
                                <div class="info-label">ID Prueba</div>
                                <div class="info-value">{prueba_id}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="material-icons">code</span>
                            <div>
                                <div class="info-label">Tecnologías</div>
                                <div class="info-value">{config.selectedTechnologies.join(',')}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="material-icons">work</span>
                            <div>
                                <div class="info-label">Posición</div>
                                <div class="info-value">{config.interviewType}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="material-icons">person</span>
                            <div>
                            <div class="info-label">Candidato</div>
                                <div class="info-value">{config.candidato}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="material-icons">schedule</span>
                            <div>
                                <div class="info-label">Duración</div>
                                <div class="info-value">{time_formathed(time)}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="material-icons">business</span>
                            <div>
                                <div class="info-label">Empresa</div>
                                <div class="info-value">{config.empresa}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="recruiter-info" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=X&size=40" 
                     alt="Recruiter Avatar" 
                     class="recruiter-avatar"/>
                <div class="recruiter-details">
                    <div class="recruiter-name">{mensajes.reclutador}</div>
                    <div class="recruiter-contact">
                        <div class="contact-item">
                            <span class="material-icons">phone</span>
                            <a href="tel:+34600000000">{mensajes.reclutador_telefono}</a>
                        </div>
                        <div class="contact-item">
                            <span class="material-icons">email</span>
                            <a href="mailto:recruiter@diverger.com">{mensajes.contacto_reclutador}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="test-explanation-card" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                <h3>La prueba consiste en:</h3>
                <div class="test-items">
                    <div class="test-item" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                        <span class="material-icons">check_circle</span>
                        <>Contestar preguntas tipo test</>
                    </div>
                    <div class="test-item" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                        <span class="material-icons">videocam</span>
                        <>Responder preguntas de desarrollo con la cámara</>
                    </div>
                    <div class="test-item" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                        <span class="material-icons">code</span>
                        <>Generar código en el IDE o añadir archivos</>
                    </div>
                    <div class="test-item" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                        <span class="material-icons">functions</span>
                        <>Resolver una pregunta de complejidad algorítmica</>
                    </div>
                    <div class="test-item" style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
                        <span class="material-icons">add_circle</span>
                        <>Completar código faltante</>
                    </div>
                </div>
                <strong class="test-duration">Tiempo disponible: {time_formathed(time)}</strong><br/>
                <>¡Suerte {config.candidato}!</><br/>
                <span class="recruiter-name">{mensajes.reclutador}</span>
            </div>
            </div>
            {
                step == 2 && (
                    <div style={{boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)', marginTop:'2%', marginBottom:'2%', padding:'4%'}}>
                    <Grid2 container spacing={2}>     
                        <Grid2 item xs={12} md={8}>
                                <>
                                {
                                   (preguntas[current_cuestion].tipo == 'Pruebas Tipo Test' && (
                                        <div>
                                            <div>Selecciona una opción válida para responder la pregunta</div>
                                            <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                            {/*<div>{marked(preguntas[current_cuestion].pregunta)}</div>*/}
                                            <div style={{marginTop:'1%'}}>
                                            {preguntas[current_cuestion].opciones.map((option, index) => {
                                                return(<div key={index} style={{marginTop:'1%'}}>
                                                <label>
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
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    (preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && <>Lee el siguiente enunciado y contesta
                                    {(preguntas[current_cuestion].tipo == 'Preguntas a Desarrollar' && (
                                        <div>
                                        <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                            {texto ? (<>
                                                <textarea className='code-editor'
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                                placeholder="// Desarrolla aquí"
                                                >
                                                </textarea>
                                                </>) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                            <div style={modalStyles}>
                                                <div className='div'>
                                                {isMediaAvailable.audio ? (
                                                    <div>
                                                    {audioBlob && (
                                                        <div>
                                                        {videoBlob ? (
                                                            <>
                                                                <video controls>
                                                                    <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <audio controls>
                                                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                Your browser does not support the audio element.
                                                                </audio></>
                                                            ) : (
                                                            <>
                                                            {
                                                            (audioBlob && !isMediaAvailable.video) &&  (
                                                            <audio controls>
                                                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                            </audio>
                                                            )
                                                            }
                                                            </>  
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={isRecording ? stopRecording : startRecording}>
                                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <textarea
                                                    className='code-editor'
                                                    value={textinput}
                                                    onChange={(e) => {handleChangeinput(e.target.value)}}
                                                    placeholder="// Desarrolla aquí"
                                                    />
                                                    </div>
                                                )}
                                                <button onClick={handleSubmit}>ENVIAR!</button>
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {setIsOpen(false); setTexto(true)}}>Cerrar</button>
                                            </div>
                                            )}
                                        </div>}
                                        </div>
                                    ))}
                                    </>)
                                }
                                {
                                    (preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && <>Evalúa el siguiente código
                                    {(preguntas[current_cuestion].tipo == 'Evaluación de Complejidad Algorítmica' && (
                                        <div>
                                            
                                            <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                            {texto ? (<>
                                                <textarea className='code-editor'
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                                placeholder="// Desarrolla aquí"
                                                >
                                                </textarea>
                                                </>) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                            <div style={modalStyles}>
                                                <div className='div'>
                                                {isMediaAvailable.audio ? (
                                                    <div>
                                                    {audioBlob && (
                                                        <div>
                                                        {videoBlob ? (
                                                            <>
                                                                <video controls>
                                                                    <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <audio controls>
                                                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                Your browser does not support the audio element.
                                                                </audio></>
                                                            ) : (
                                                            <>
                                                            {
                                                            (audioBlob && !isMediaAvailable.video) &&  (
                                                            <audio controls>
                                                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                            </audio>
                                                            )
                                                            }
                                                            </>  
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={isRecording ? stopRecording : startRecording}>
                                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <textarea
                                                    className='code-editor'
                                                    value={textinput}
                                                    onChange={(e) => {handleChangeinput(e.target.value)}}
                                                    placeholder="// Desarrolla aquí"
                                                    />
                                                    </div>
                                                )}
                                                <button onClick={handleSubmit}>ENVIAR!</button>
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {setIsOpen(false); setTexto(true)}}>Cerrar</button>
                                            </div>
                                            )}
                                        </div>}
                                        </div>
                                    ))}</>)
                                }
                                {
                                    ( preguntas[current_cuestion].tipo == 'Desarrollo de Código' &&  <>Desarrolla un código según el siguiente enunciado
                                    {(preguntas[current_cuestion].tipo == 'Desarrollo de Código' && (
                                        <div>
                                            <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                            {texto ? (<>
                                                <textarea className='code-editor'
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                                placeholder="// Desarrolla aquí"
                                                >
                                                </textarea>
                                                </>) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                            <div style={modalStyles}>
                                                <div className='div'>
                                                {isMediaAvailable.audio ? (
                                                    <div>
                                                    {audioBlob && (
                                                        <div>
                                                        {videoBlob ? (
                                                            <>
                                                                <video controls>
                                                                    <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <audio controls>
                                                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                Your browser does not support the audio element.
                                                                </audio></>
                                                            ) : (
                                                            <>
                                                            {
                                                            (audioBlob && !isMediaAvailable.video) &&  (
                                                            <audio controls>
                                                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                            </audio>
                                                            )
                                                            }
                                                            </>  
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={isRecording ? stopRecording : startRecording}>
                                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <textarea
                                                    className='code-editor'
                                                    value={textinput}
                                                    onChange={(e) => {handleChangeinput(e.target.value)}}
                                                    placeholder="// Desarrolla aquí"
                                                    />
                                                    </div>
                                                )}
                                                <button onClick={handleSubmit}>ENVIAR!</button>
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {setIsOpen(false); setTexto(true)}}>Cerrar</button>
                                            </div>
                                            )}
                                        </div>}
                                        </div>
                                    ))}</>)
                                }
                                {
                                    ( preguntas[current_cuestion].tipo == 'Corrección de Errores' && <>Corrige los errores del código
                                    {(preguntas[current_cuestion].tipo == 'Corrección de Errores' && (
                                        <div>
                                            <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                            {texto ? (<>
                                                <textarea className='code-editor'
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                                placeholder="// Desarrolla aquí"
                                                >
                                                </textarea>
                                                </>) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                            <div style={modalStyles}>
                                                <div className='div'>
                                                {isMediaAvailable.audio ? (
                                                    <div>
                                                    {audioBlob && (
                                                        <div>
                                                        {videoBlob ? (
                                                            <>
                                                                <video controls>
                                                                    <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <audio controls>
                                                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                Your browser does not support the audio element.
                                                                </audio></>
                                                            ) : (
                                                            <>
                                                            {
                                                            (audioBlob && !isMediaAvailable.video) &&  (
                                                            <audio controls>
                                                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                            </audio>
                                                            )
                                                            }
                                                            </>  
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={isRecording ? stopRecording : startRecording}>
                                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <textarea
                                                    className='code-editor'
                                                    value={textinput}
                                                    onChange={(e) => {handleChangeinput(e.target.value)}}
                                                    placeholder="// Desarrolla aquí"
                                                    />
                                                    </div>
                                                )}
                                                <button onClick={handleSubmit}>ENVIAR!</button>
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {setIsOpen(false); setTexto(true)}}>Cerrar</button>
                                            </div>
                                            )}
                                        </div>}
                                            
                                        </div>
                                    ))}</>)
                                }
                                {
                                   ( preguntas[current_cuestion].tipo == 'Completar Código' &&  <>Evalua el siguiente código y completalo
                                   {(preguntas[current_cuestion].tipo == 'Completar Código' && (
                                        <div>
                                           <div dangerouslySetInnerHTML={{ __html: marked(preguntas[current_cuestion].pregunta) }} />
                                           {texto ? (<>
                                                <textarea className='code-editor'
                                                value={textinput}
                                                onChange={(e) => {handleChangeinput(e.target.value)}}
                                                placeholder="// Desarrolla aquí"
                                                >
                                                </textarea>
                                                </>) : <div>
                                                {/*grabador de video*/}
                                            <button onClick={(e) => {setIsOpen(true); setTexto(false)}}>Grabar Video</button>
                                            {isOpen && (
                                            <div style={modalStyles}>
                                                <div className='div'>
                                                {isMediaAvailable.audio ? (
                                                    <div>
                                                    {audioBlob && (
                                                        <div>
                                                        {videoBlob ? (
                                                            <>
                                                                <video controls>
                                                                    <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <audio controls>
                                                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                Your browser does not support the audio element.
                                                                </audio></>
                                                            ) : (
                                                            <>
                                                            {
                                                            (audioBlob && !isMediaAvailable.video) &&  (
                                                            <audio controls>
                                                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                            </audio>
                                                            )
                                                            }
                                                            </>  
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={isRecording ? stopRecording : startRecording}>
                                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <textarea
                                                    className='code-editor'
                                                    value={textinput}
                                                    onChange={(e) => {handleChangeinput(e.target.value)}}
                                                    placeholder="// Desarrolla aquí"
                                                    />
                                                    </div>
                                                )}
                                                <button onClick={handleSubmit}>ENVIAR!</button>
                                                </div>
                                                {videoBlob && (
                                                    <div>
                                                        <button onClick={handleUpload}>Enviar respuesta</button>
                                                    </div>
                                                )}
                                                <button onClick={(e) => {setIsOpen(false); setTexto(true)}}>Cerrar</button>
                                            </div>
                                            )}
                                        </div>}
                                        </div>
                                    ))}</>)
                                }
                                </>
                        </Grid2>
                    </Grid2>
                    <div class="navigation-buttons" style={{backgroundColor:'white'}}>
                    <div class="nav-group">
                        {
                            preguntas[current_cuestion].tipo == 'Pruebas Tipo Test' &&
                            <>
                             {(max_preguntas != cc) && <Button onClick={(e) => guardar_respuesta(respuesta_M[0])}>
                        Guardar Respuesta
                        <span class="material-icons">arrow_forward</span>
                        </Button>}
                        {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(respuesta_M[0])}}>
                        Finalizar
                        </Button>}
                            </>
                        }
                        {
                            preguntas[current_cuestion].tipo != 'Pruebas Tipo Test' &&
                            <>{texto ? <Button onClick={(e) => {setIsOpen(true); setTexto(false); console.log('apretando')}}>Grabar video</Button> : <Button>Escribir texto</Button>}</> 
                        }
                    { preguntas[current_cuestion].tipo != 'Pruebas Tipo Test' && <>
                    {(max_preguntas != cc) && <Button  onClick={(e) => guardar_respuesta(textinput)}>
                        Guardar Respuesta
                        <span class="material-icons">arrow_forward</span>
                        </Button>}
                    {(max_preguntas == cc) && <Button onClick={(e) => {setStape(3); finalizar(textinput)}}>
                        Finalizar
                        </Button>}
                        </>}
                    
                </div>
                    </div>
                    </div>
                )
            }
                    </div>}
                    {
                        step == 3 && 
                        <div>
                        <h1>Test ya finalizado</h1>
                        <h3>El reclutador ya ha recibido la evaluacion y el resultado.</h3>
                        <h4>Revisa tu email, el reclutador puede enviarte los resultados de tu test</h4>
                        </div>
                    }
                    </>
                )
            }
            </div> : <div>

            </div>
        }
        </>
    )
}

export default Talent