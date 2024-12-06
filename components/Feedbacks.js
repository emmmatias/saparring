import { useState, useEffect, createContext } from "react"
import { useAuth } from '../components/AuthProvider'
import '@/components/feedback.module.css'
import { copyStringIntoBuffer } from "pdf-lib";
import Loader from "./Loader";

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const anio = fecha.getUTCFullYear();
    
    return `${dia}/${mes}/${anio}`;
}

// Ejemplo de uso
const fechaActual = new Date(); // Fecha actual
const fechaFormateada = formatearFecha(fechaActual);
console.log(fechaFormateada); // Salida: "13/11/23" (dependiendo de la fecha actual)

const Detail = (props) => {
    const [config, setConfig] = useState({})
    const [puntos_fuertes, setpuntos_fuertes] = useState([])
    const [puntos_debiles, setpuntos_debiles] = useState([])
    const [sugerencia, setsugerencia] = useState([])
    const [comentario, setcomentario] = useState([])
    const [puntuacion, setPuntuacion] = useState([]) 
    const [visible, setvisible] = useState(null)
    const [message, setmessage] = useState('')
    const [respuestas, setRespuestas] = useState('')
    const [aAgregar1, setaAgregar1] = useState('')
    const [aAgregar2, setaAgregar2] = useState('')
    const [aAgregar3, setaAgregar3] = useState('')
    const [aAgregar4, setaAgregar4] = useState('')
    const [puntosdebiles, setpuntosdebiles] = useState([])
    const { isAuthenticated, login, logout, user, userType } = useAuth()

    const extraerpuntosfuertes = (texto) => {
        const regex = /<punto fuerte>(.*?)<punto fuerte>/g
        const resultados = [];
        let match;

    while ((match = regex.exec(texto)) !== null) {
        resultados.push(match[1])
    }
    let r = resultados.filter(el => {el == 'punto fuerte identificado'})
    return resultados;
    }
    
    const extraerpuntosdebiles = (texto) => {
        const regex = /<punto debil>(.*?)<punto debil>/g
        const resultados = [];
        let match;

    while ((match = regex.exec(texto)) !== null) {
        resultados.push(match[1])
    }
    let r = resultados.filter(el => {el != 'punto debil identificado'})
    return resultados;
    } 

    const extraercomentario = (texto) => {
        const regex = /<comentario>(.*?)<comentario>/g
        const resultados = [];
        let match;

    while ((match = regex.exec(texto)) !== null) {
        resultados.push(match[1])
    }

    return resultados;
    }

    function extraerTextos(texto) {
        const regex = /@([^@]+)@/g;
        const textoArray = [];
        let coincidencia;
      
        while ((coincidencia = regex.exec(texto))) {
          textoArray.push(coincidencia[1].trim());
        }
      
        return textoArray;
      }

    const extrersugerencia = (texto) => {
        const regex = /<sugerencia>(.*?)<sugerencia>/g
        const resultados = [];
        let match;

    while ((match = regex.exec(texto)) !== null) {
        resultados.push(match[1])
    }
    console.log('sugerencias', resultados)
    return resultados;
    }
    
    useEffect(() => {
        console.log('el config del detail es:', config)
    },[config])

    useEffect(() => {
        console.log(props.detail)
        let obj = JSON.parse(props.detail[0].config)
        setConfig(obj)
        console.log('config', config)
        setPuntuacion(props.detail[0].feedbacks.match(/Puntuación:\s*(\d+)/g))
        console.log('feedbacks: ', props.detail[0])
        let res = props.detail[0].respuestas
        setRespuestas(extraerTextos(res))
        setpuntos_fuertes(extraerpuntosfuertes(props.detail[0].feedbacks))
        setpuntos_debiles(extraerpuntosdebiles(props.detail[0].feedbacks))
        setsugerencia(extrersugerencia(props.detail[0].feedbacks))
        setcomentario(extraercomentario(props.detail[0].feedbacks))
    },[])

    useEffect(() => {
        console.log(sugerencia)
    },[sugerencia])

    const enviarfeedback = async () => {
        let response = await fetch('/api/enviarfeedback',{
            method:'POST',
            body: JSON.stringify({
                mail: config.emailCandidato,
                candidato: config.candidato,
                id_prueba: props.detail[0].id_prueba,
                empresa: user, 
                fecha: new Date().toLocaleDateString() 
            })
        })
        if(response.ok){
            let data = await response.json()
            setvisible(true)
            setmessage(data.message)
        }
        if(!response.ok){
            setvisible(true)
            let data = await response.json()
            setmessage(data.message)
        }
    }

    const agregarpuntofuerte = () => {
        setpuntos_fuertes(prev => [...prev, aAgregar1])
        setaAgregar1('')
    }


    const agregarpuntodebil = () => {
        setpuntos_debiles(prev => [...prev, aAgregar2])
        setaAgregar2('')
    } 

    const agregarsugerencia = () => {
        setsugerencia(prev => [...prev, aAgregar3])
        setaAgregar3('')
    }

    const agregarcomentario = () => {
        setcomentario(prev => [...prev, aAgregar4])
        setaAgregar4('')
    }

    const editarcomentario = (e, index) => {
        const content  = e.target.innerText
        let comentariosprevios = [...comentario]
        comentariosprevios[index] = content
        setcomentario(comentariosprevios)
        console.log(comentariosprevios[index])
    }

    const editarsugerencia = (e, index) => {
        const content  = e.target.innerText
        let sugerencias_previas = [...sugerencia]
        sugerencias_previas[index] = content
        setsugerencia(sugerencias_previas)
        console.log(sugerencias_previas[index])
    }


    const guardar_cambios = async () => {
        let str = []
        let con = props.detail[0].feedbacks
        const texto_sin_fuertes = con.replace(/<punto fuerte>(.*?)<punto fuerte>/gs, '')
        const texto_sin_debiles = texto_sin_fuertes.replace(/<punto debil>(.*?)<punto debil>/gs, '')
        const texto_sin_comentarios = texto_sin_debiles.replace(/<comentario>(.*?)<comentario>/gs, '')
        const texto_sin_sugerencias = texto_sin_comentarios.replace(/<sugerencia>(.*?)<sugerencia>/gs, '')

        let a = puntos_fuertes.map(el => {return(`<punto fuerte>${el}<punto fuerte>`)})
        for(let aa of a){
            str.push(aa) 
        }
        let b = puntos_debiles.map(el => {return(`<punto debil>${el}<punto debil>`)})
        for(let bb of b){
            str.push(bb) 
        }
        let c = comentario.map(el => {return(`<comentario>${el}<comentario>`)})
        for(let cc of c){
            str.push(cc) 
        }
        let d = sugerencia.map(el => {return(`<sugerencia>${el}<sugerencia>`)})
        for(let dd of d){
            str.push(dd)
        }
          console.log(texto_sin_sugerencias.replace(/<comentario>(.*?)<comentario>/gs, ''))
          console.log(str.join(' '))
          console.log('a remplazar: ',  `${str.join(' ')} ${texto_sin_sugerencias.replace(/<comentario>(.*?)<comentario>/gs, '')}`)
          let rr = `${str.join(' ')} ${texto_sin_sugerencias.replace(/<comentario>(.*?)<comentario>/gs, '')}`
        let response = await fetch('/api/editar_feedback', {
            method:'POST',
            body: JSON.stringify({
                data: rr,
                id_respuesta: props.detail[0].id_respuesta
            })
        })
        if(response.ok){
            let data = await response.json()
            setvisible(true)
            setmessage(data.message)
        }
        if(!response.ok){
            setvisible(true)
            let data = await response.json()
            data.message ? setmessage(data.message) : setmessage('Error al modificar')
        }

    }

    const cambiarpuntof = (e, index) => {
      
        let fuertes_anteriores = [...puntos_fuertes]
        fuertes_anteriores[index] = e.target.innerText
        setpuntos_fuertes(fuertes_anteriores)

    }


    const cambiarpuntod = (e, index) => {

        let debiles_anteriores = puntos_debiles
        debiles_anteriores[index] = e.target.innerText
        setpuntos_debiles(debiles_anteriores)
        
    }
    

      const style22 = {
        popup: {
            display: 'block', /* Usar flex para centrar el contenido */
            position: 'fixed', /* Fijo en la ventana */
            zIndex: 1000, /* Por encima de otros elementos */
            left: '35%',
            top: '40%',
            textAlign: 'center',
            backgroundColor: 'white', /* Fondo semi-transparente */
            borderColor: 'black',
            alignItems: 'center',
            BorderStyle: 'solid',
            borderRadius: '10px',
            boxShadow:'2px 2px 10px 2px rgba(0, 0, 0, 0.5)',
            padding:'5%'
        }
      }

    return(
        <>
        {visible && (
        <div style={style22.popup}>
          <p>{message}</p>
          <button className="btn-feedback" onClick={(e) => {setvisible(null)}}>cerrar</button>
        </div>
        )}
        <div>
            <table className="feedback-table">
            <thead>
                <tr>
                    <th>ID Prueba</th>
                    <th>Candidato</th>
                    <th>Fecha Realización</th>
                    <th>Tecnologías</th>
                    <th>Nivel</th>
                    <th>Puntuación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            {
            props.detail.map((el, index) => {
                       let config = JSON.parse(el.config)
                       console.log(el)
                       return(
                           <tr key={index}>
                           <td><span class="test-id">{el.id_prueba}</span></td>
                           <td>
                           <div class="candidate-info">
                               <div class="candidate-details">
                                   <span class="candidate-name">{config.candidato}</span>
                                   <span class="candidate-email">{`${config.emailCandidato.slice(0,10)}...`}</span>
                               </div>
                           </div>
                           </td>
                           <td className="date-cell">{el.termino ? formatearFecha(el.termino) : 'No definido'}</td>
                           <td className="tech-tags" style={{display: 'flex'}}>
                               {config.selectedTechnologies.map((el, index) => {
                                   return(
                                   <div key={index} style={{display:'inline'}}><span class="tech-tag">{el}</span></div>
                               )})}</td>
                           <td>
                           <span class={`level-badge level-${config.interviewLevel}`}>
                           {config.interviewLevel}
                           </span>
                           </td>
                           <td>
                               {<div class="score">
                                   <span class="score-value">{`${el.puntaje_final}/100`}</span>
                                   <div class="score-bar">
                                       <div class="score-fill" style={{width: `${el.puntaje_final}%`}}></div>
                                   </div>
                               </div>}
                           </td>
                           <td>
                           <button onClick={(e) => props.cerrar()} class={`btn-feedback ${el.feedbacks.length > 0 ? 'available' : 'pending'}`}
                                   >
                               <span class="material-icons">
                                   close
                               </span>
                               cerrar
                           </button>
                           </td>
                           </tr>
                       )
            })
            }
            </table>
        </div>
        <div>
        <div>
            <button className="btn btn-primary" type="button" onClick={(e)=>{enviarfeedback()}}>
            <span class="material-icons">mail</span>
              Enviar feedback
            </button>
        </div>
        <div>
            <button className="btn btn-primary" type="button" onClick={guardar_cambios}>
            <span class="material-icons">save</span>
              Guardar cambios
            </button>
        </div>
        <div class="test-info">
            <h2 class="title is-4">Información de la Prueba</h2>
            <strong>ID de la Prueba:</strong> <span id="test-id">{props.detail[0].id_prueba}</span><br/>
            <strong>Posición:</strong> <span id="test-position">{config.interviewrole}</span><br/>
            <strong>Nivel:</strong> <span id="test-position">{config.interviewType}</span><br/>
            <strong>Puntuación global:{props.detail[0].puntaje_final}/100</strong><br/>
            <strong>Empresa:{config.empresa}</strong><br/>
            <strong>Candidato:{config.candidato}</strong><br/>
            <strong>Email Candidato:{config.emailCandidato}</strong>
        </div>
        
        <div>
            {
                <div>
                    
                </div>
            }
        </div>
        <div class="feedback-section">
                    <h2 class="title is-3">Resumen</h2>
                    <div class="feedback-content">
                        <div class="feedback-highlight">
                            <strong><i class="fas fa-star"></i> Puntos fuertes: </strong>
                            <ul>
                                {puntos_fuertes.map((el, index) => {return(
                                   <li key={index} contentEditable onInput={(e) => cambiarpuntof(e, index)} onBlur={guardar_cambios} ><i class="fas fa-check"></i>{el}</li> 
                                )})}
                            </ul>
                            <input style={{display:'block', borderRadius:'10px', borderColor:'black', marginBottom:'1%'}} value={aAgregar1} onChange={(e) => {setaAgregar1(e.target.value)}} placeholder="Agrega un punto fuerte"/>
                            <button className="btn-feedback" onClick={agregarpuntofuerte}>Agregar</button>
                        </div>
                        <div class="feedback-highlight">
                            <strong><i class="fas fa-star"></i> Puntos Débiles:</strong>
                            <ul>
                                {puntos_debiles.map((el, index) => {return(
                                   <li key={index} contentEditable onInput={(e) => {cambiarpuntod(e, index)}} onBlur={guardar_cambios} ><i class="fas fa-check"></i>{el}</li> 
                                )})}
                            </ul>
                            <input style={{display:'block', borderRadius:'10px', borderColor:'black', marginBottom:'1%'}} value={aAgregar2} onChange={(e) => {setaAgregar2(e.target.value)}} placeholder="Agrega un punto fuerte"/>
                            <button className="btn-feedback" onClick={agregarpuntodebil}>Agregar</button>
                        </div>
                        <div class="feedback-highlight">
                            <strong><i class="fas fa-bullseye"></i> Áreas de mejora:</strong>
                            <ul>
                                {
                                    sugerencia.map((el, index) => {return(<li contentEditable onBlur={(e) => {editarsugerencia(e,index)}} key={index}><i class="fas fa-arrow-up"></i> {el} </li>)})
                                }
                            </ul>
                            <input style={{display:'block', borderRadius:'10px', borderColor:'black', marginBottom:'1%'}} value={aAgregar3} onChange={(e) => {setaAgregar3(e.target.value)}} placeholder="Agrega un punto fuerte"/>
                            <button className="btn-feedback" onClick={agregarsugerencia}>Agregar</button>
                        </div>
                        <div style={{marginTop:'1%'}}>
                        <div>{comentario.map((el, index) => {return(
                            <div key={index} style={{marginBottom:'2%'}}>
                            {respuestas[index] && <div>{`Respuesta n°${index + 1}: ${respuestas[index].slice(0 , 50)}`}</div>}
                            <div contentEditable onBlur={(e) => {editarcomentario(e,index)}}>{el}</div>
                            </div>
                        )
                            })}</div>
                        </div>
                        <input style={{display:'block', borderRadius:'10px', marginBottom:'1%'}} value={aAgregar4} onChange={(e) => {setaAgregar4(e.target.value)}} placeholder="Agrega un punto fuerte"/>
                        <button className="btn-feedback" onClick={agregarcomentario}>Agregar</button>
                    </div>
                </div>
        </div>
        <div>
            <button className="btn btn-primary" type="button" onClick={guardar_cambios}>
            <span class="material-icons">save</span>
              Guardar cambios
            </button>
        </div>
        </>
    )

}

const Feedbacks = (props) => {
    const [result, setResult] = useState([])
    const [prueba_id, setprueba_id] = useState('')
    const [candidato, setcandidato] = useState('')
    const [detail, setDetail] = useState('')
    const [emial, setemial] = useState('') 
    const [filteredarray, setfilteredarray] = useState([])
    const [tecnologia, settecnologia] = useState('')
    const [nivel, setnivel] = useState('')
    const [puntacion, setpuntacion] = useState('')
    const { isAuthenticated, login, logout, user, userType } = useAuth()

    const limpiar_filtros = () => {
        setprueba_id('')
        setcandidato('')
        setemial('')
        settecnologia('')
        setnivel('')
        setpuntacion('')
    }

    const obtener_feedbacks = async () => {
        console.log('La empresa es: ', user)
        let response  = await fetch(`/api/obtner_feedbacks?empresa=${user}`)
        if(response.ok){
            let data = await response.json()
            setResult(data.feedbacks)
        }
        if(!response.ok){
            let data = await response.json()
        }
    } 
    //filtrar feedbacks
    useEffect(() => {
        if(prueba_id.length > 0 || candidato.length > 0 || emial.length > 0 || tecnologia.length > 0 || nivel.length > 0 || puntacion.length > 0){
            const filter = result.filter(el => {
                const config = JSON.parse(el.config)
                if(prueba_id.length > 0){
                    return el.id_prueba.includes(prueba_id)
                }
                if(candidato.length > 0 ){
                    return config.candidato.includes(candidato)
                }
                if(emial.length > 0){
                    return config.emailCandidato.includes(emial)
                }
                if(tecnologia.length > 0){
                    return config.selectedTechnologies.join(',').includes(emial)
                }
                if(nivel.length > 0){
                    return config.interviewLevel.includes(nivel)
                }
                if(puntacion.length > 0){
                    return el.puntaje_final >= puntacion
                }
            })
        setfilteredarray(filter)
        }
        if(prueba_id.length == 0 && candidato.length == 0 && emial.length == 0 && tecnologia.length == 0 && nivel.length == 0 && puntacion.length == 0){
        setfilteredarray([])
        }
    }, [prueba_id, candidato, emial, tecnologia, nivel, puntacion])

    useEffect(() => {
        console.log('detail', detail)
    },[detail])

    //obtener todos los feedbacks para una empresa
    useEffect(() => {
        console.log('filtered array es: ', filteredarray)
        obtener_feedbacks()
    },[])

    useEffect(() => {
        console.log(result)
    },[result])

    const cerrar = () => {
        setDetail(false)
    }

    return(
        <div style={{maxWidth:'80 %'}}>
        {!detail && <div class="search-container">
            <div class="search-section">
                <div class="search-header">
                    <div class="search-title">
                        <span class="material-icons">manage_search</span>
                        <h2>Filtrar Feedbacks</h2>
                    </div>
                    <button class="btn-clear" onClick={(e) => {limpiar_filtros(e)}}>
                        <span class="material-icons">clear</span>
                        Limpiar filtros
                    </button>
                </div>
                <div class="search-content">
                    <div class="search-row">
                        <div class="search-field">
                            <div class="search-field-header">
                                <span class="material-icons">tag</span>
                                <label class="search-label">ID de Prueba</label>
                            </div>
                            <input type="text" 
                                   placeholder="Ej: TEST001"
                                   onChange={(e) => {setprueba_id(e.target.value)}} 
                                   class="search-input monospace"
                                   onkeyup="filterFeedbacks()"/>
                        </div>
                        <div class="search-field">
                            <div class="search-field-header">
                                <span class="material-icons">person</span>
                                <label class="search-label">Candidato</label>
                            </div>
                            <input type="text"
                                onChange={(e) => {setcandidato(e.target.value)}}  
                                   placeholder="Nombre del candidato" 
                                   class="search-input"
                                   onkeyup="filterFeedbacks()"/>
                        </div>
                    </div>

                    <div class="search-row">
                        <div class="search-field">
                            <div class="search-field-header">
                                <span class="material-icons">mail</span>
                                <label class="search-label">Email</label>
                            </div>
                            <input type="text"
                            onChange={(e) => {setemial(e.target.value)}} 
                                   placeholder="email@ejemplo.com" 
                                   class="search-input"
                                   onkeyup="filterFeedbacks()"/>
                        </div>

                        <div class="search-field">
                            <div class="search-field-header">
                                <span class="material-icons">code</span>
                                <label class="search-label">Tecnología</label>
                            </div>
                            <input type="text"
                                    onChange={(e) => {settecnologia(e.target.value)}} 
                                   placeholder="React, Python, Java..." 
                                   class="search-input"
                                   onkeyup="filterFeedbacks()"/>
                        </div>
                    </div>

                    <div class="search-row">
                        <div class="search-field1">
                            <div class="search-field-header">
                                <span class="material-icons">trending_up</span>
                                <label class="search-label">Nivel</label>
                            </div>
                            <input type="text" 
                                   placeholder="Junior, Mid-Senior, Senior" 
                                   class="search-input"
                                   onChange={(e) => {setnivel(e.target.value)}} 
                                   onkeyup="filterFeedbacks()" />
                        </div>

                        <div class="search-field">
                            <div class="search-field-header">
                                <span class="material-icons">grade</span>
                                <label class="search-label">Puntuación mínima</label>
                            </div>
                            <input type="number" 
                                   min="0" 
                                   max="100"
                                   onChange={(e) => {setpuntacion(e.target.value)}}  
                                   placeholder="Ej: 80" 
                                   class="search-input"
                                   onkeyup="filterFeedbacks()"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        {
            detail ? <Detail detail={detail} cerrar={cerrar}/> :
            <>
            {
            filteredarray.length > 0 ? <table className="feedback-table" >
                <thead>
                <tr>
                    <th>ID Prueba</th>
                    <th>Candidato</th>
                    <th>Fecha Realización</th>
                    <th>Tecnologías</th>
                    <th>Nivel</th>
                    <th>Puntuación</th>
                    <th>Feedback</th>
                </tr>
                </thead>
            <tbody id="feedbackTableBody">
                {
                 filteredarray.map((el, index) => {
                    let config = JSON.parse(el.config)
                    return(
                        <tr key={index}>
                        <td><span class="test-id">{el.id_prueba}</span></td>
                        <td>
                        <div class="candidate-info">
                            <div class="candidate-details">
                                <span class="candidate-name">{config.candidato}</span>
                                <span class="candidate-email">{`${config.emailCandidato.slice(0,10)}...`}</span>
                            </div>
                        </div>
                        </td>
                        <td className="date-cell">{el.termino ? formatearFecha(el.termino): 'No definido'}</td>
                        <td className="tech-tags" style={{display: 'flex'}}>
                            {config.selectedTechnologies.map((el, index) => {
                                return(
                                <div key={index} style={{display:'inline'}}><span class="tech-tag">{el}</span></div>
                            )})}</td>
                        <td>
                        <span class={`level-badge level-${config.interviewLevel}`}>
                        {config.interviewLevel}
                        </span>
                        </td>
                        <td>
                            {<div class="score">
                                <span class="score-value">{el.puntaje_final}/100</span>
                                <div class="score-bar">
                                    <div class="score-fill" style={{width: `${el.puntaje_final}%`}}></div>
                                </div>
                            </div>}
                        </td>
                        <td>
                        <button disabled={el.feedbacks.length < 0} onClick={(e) => {setDetail([filteredarray[index]])}} class={`btn-feedback ${el.feedbacks.length > 0 ? 'available' : 'pending'}`}
                                
                                >
                            <span class="material-icons">
                                {el.feedbacks.length > 0 ? 'rate_review' : 'pending_actions'}
                            </span>
                            {el.feedbacks.length > 0 ? 'Ver Feedback' : 'Pendiente'}
                        </button>
                        </td>
                        </tr>
                    )
                })   
                }
            </tbody>
            </table> :
            <>
            {
            result.length > 0 ?
            <div>
            <table className="feedback-table">
            <thead>
                <tr>
                    <th>ID Prueba</th>
                    <th>Candidato</th>
                    <th>Fecha Realización</th>
                    <th>Tecnologías</th>
                    <th>Nivel</th>
                    <th>Puntuación</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody id="feedbackTableBody">
            {
                result.map((el, index) => {
                    let config = JSON.parse(el.config)
                    return(
                        <tr key={index}>
                        <td><span class="test-id">{el.id_prueba}</span></td>
                        <td>
                        <div class="candidate-info">
                            <div class="candidate-details">
                                <span class="candidate-name">{config.candidato}</span>
                                <span class="candidate-email">{`${config.emailCandidato.slice(0,10)}...`}</span>
                            </div>
                        </div>
                        </td>
                        <td className="date-cell">{el.termino ? formatearFecha(el.termino)  : 'No definido'}</td>
                        <td className="tech-tags" style={{display: 'flex'}}>
                            {config.selectedTechnologies.map((el, index) => {
                                return(
                                <div key={index} style={{display:'inline'}}><span class="tech-tag">{el}</span></div>
                            )})}</td>
                        <td>
                        <span class={`level-badge level-${config.interviewLevel}`}>
                        {config.interviewLevel}
                        </span>
                        </td>
                        <td>
                            {<div class="score">
                                <span class="score-value">{el.puntaje_final}/100</span>
                                <div class="score-bar">
                                    <div class="score-fill" style={{width: `${el.puntaje_final}%`}}></div>
                                </div>
                            </div>}
                        </td>
                        <td>
                        <button onClick={(e) => {setDetail([result[index]])}} class={`btn-feedback ${el.feedbacks.length > 0 ? 'available' : 'pending'}`}
                                >
                            <span class="material-icons">
                                {el.feedbacks.length > 0 ? 'rate_review' : 'pending_actions'}
                            </span>
                            {el.feedbacks.length > 0 ? 'Ver Feedback' : 'Pendiente'}
                        </button>
                        </td>
                        </tr>
                    )
                })
            }
            </tbody>
            </table>
            </div> :
            <>
            <Loader/></>
            }
            </>
            }
            </>
        }
        </div>
    )

}

export default Feedbacks