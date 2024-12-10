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
import { useAuth } from '../components/AuthProvider';
import { useRouter } from "next/router";
import Loader from "./Loader";



const Detail = (props) => {
    //queremos ver las preguntas e incluso poder modificarla o eliminarla
    //el atributo data guarda los datos de la row
    const [config, setConfig] = useState()
    const [preguntas, setPreguntas] = useState()
    const [message, setMessage] = useState('')
        
    
        const handledit = (event, index) => {
            const { value } = event.target;
            setPreguntas(prev => ({
              ...prev,
              preguntas_generadas: [
                ...prev.preguntas_generadas.slice(0, index),
                { ...prev.preguntas_generadas[index], pregunta: value },
                ...prev.preguntas_generadas.slice(index + 1),
              ],
            }));
          }
          
          const handleditoption = (event, indexPregunta, indexOpcion) => {
            const { value } = event.target;
            setPreguntas(prev => ({
              ...prev,
              preguntas_generadas: prev.preguntas_generadas.map((pregunta, idx) => {
                if (idx === indexPregunta) {
                  return {
                    ...pregunta,
                    opciones: pregunta.opciones.map((opcion, idxOpcion) => {
                      if (idxOpcion === indexOpcion) {
                        return value;
                      }
                      return opcion;
                    }),
                  };
                }
                return pregunta;
              }),
            }));
          }
          
          const guardarModif = async (e) => {
            e.preventDefault()
            let respose = await fetch('/api/editar_sparring',{
              method:'POST',
              body: JSON.stringify({
                id: props.data.id,
                preguntas_generadas: preguntas.preguntas_generadas
              })
            })
            if(respose.ok){
              let data = await respose.json()
              setMessage(data.message ? data.message : 'Cambios guardados')
              props.main
            }else{
              setMessage('Error al guardar edicion')
            }
          }

    const extraerData = async () => {
        let preguntas = await JSON.parse(props.data.preguntas)
        let config = await JSON.parse(props.data.config)
        setConfig(config)
        setPreguntas(preguntas)
    }
    
    useEffect(() => {
        extraerData()
    },[])

    return(
        <div>
        <table className="tests-table">
        <thead>
                        <tr>
                            <th>ID Prueba</th>
                            <th>Categoría</th>
                            <th>Nivel</th>
                            <th>Tiempo</th>
                            <th>Candidato</th>
                            <th>Acciones</th>
                        </tr>
        </thead>
        {
            <tbody>
            {
                    config && 
                    <tr className="test-row">
                        <td>{props.data.id}</td>
                        <td><span className="badge badge-category">{config.interviewType}</span></td>
                        <td><span className="badge badge-level">{config.interviewLevel}</span></td>
                        <td><span className="badge badge-time">{config.time}</span></td>
                        <td>
                        <div className="candidate-info">
                            <span className="candidate-name">{config.candidato}</span>
                            <span className="candidate-email">{config.emailCandidato || 'Email no provisto'}</span>
                        </div>
                        </td>
                        <td>
                            <button className="btn-view" onClick={props.cerrar}>
                                <span className="material-icons">close</span>
                                Cerrar
                            </button>
                        </td>
                    </tr>
            }
            </tbody>
        }
        </table>
        <div>
            <button className="btn btn-primary" type="button" onClick={(e)=>{e.preventDefault()}}>
            <span class="material-icons">mail</span>
              Enviar invitación
            </button>
        </div>
        {
            preguntas ? <>
            {preguntas.preguntas_generadas.map((el,index) => {
              if(el.tipo == 'Pruebas Tipo Test'){
                return(
                  <div key={index} class="config-card">
                    <div class="config-header">
                      <div class="config-icon" style={{backgroundColor: "#1976d2"}}>
                        <span class="material-icons">quiz</span>
                      </div>
                        <h2 class="config-title">Preguntas Tipo Test</h2>
                        <span class="material-icons help-icon" onclick="mostrarAyuda('test')">help_outline</span>
                      </div>
                    <div class="question-editor">
                    <textarea className='textarea' key={index} onChange={(event) => {handledit(event, index)}} value={el.pregunta}/>
                    {el.opciones.map((el1, index1) => {
                      return(
                        <div key={index1} class="option-row correct-option">
                          <textarea onChange={(event) => {handleditoption(event, index, index1)}} class="edit-field" type='text' value={el1}/>
                        </div>
                      )
                    })}
                    </div>
                    <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onClick={(e) => {guardarModif(e)}}>
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                  </div>
                )
              }
              if(el.tipo == 'Preguntas a Desarrollar'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                    <div class="config-icon" style={{backgroundColor: "#2e7d32"}}>
                        <span class="material-icons">description</span>
                    </div>
                    <h2 class="config-title">Preguntas de Desarrollo</h2>
                    <span class="material-icons help-icon" onclick="mostrarAyuda('desarrollo')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <textarea className='textarea' key={index} onChange={(event) => handledit(event, index)} class="edit-field" rows="4" value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Desarrollo de Código'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#ed6c02"}}>
                    <span class="material-icons">code</span>
                </div>
                <h2 class="config-title">Desarrollo de Código</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('codigo')">help_outline</span>
                  </div>
                  <div class="question-editor">
                    <textarea className='textarea' key={index} onChange={(event) => handledit(event, index)} class="edit-field" rows="4" value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Corrección de Errores'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#d32f2f"}}>
                    <span class="material-icons">bug_report</span>
                </div>
                <h2 class="config-title">Corrección de Errores</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('errores')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <textarea className='textarea' class="edit-field" onChange={(event) => handledit(event, index)} key={index} value={el.pregunta}/>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Completar Código'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#9c27b0"}}>
                    <span class="material-icons">build</span>
                </div>
                <h2 class="config-title">Completar Código</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('completar')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <div class="code-block" style={{backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px", marginTop: "12px"}}>
                  <textarea className='textarea' key={index} class="edit-field" onChange={(event) => handledit(event, index)} value={el.pregunta} rows="20" style={{fontFamily: "monospace"}} />
                  </div>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>)
              }
              if(el.tipo == 'Evaluación de Complejidad Algorítmica'){
                return(<div key={index} class="config-card">
                  <div class="config-header">
                <div class="config-icon" style={{backgroundColor: "#0288d1"}}>
                    <span class="material-icons">analytics</span>
                </div>
                <h2 class="config-title">Análisis de Complejidad</h2>
                <span class="material-icons help-icon" onclick="mostrarAyuda('complejidad')">help_outline</span>
                  </div>
                  <div class="question-editor">
                  <div class="code-block" style={{backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px", marginTop: "12px"}}>
                  <textarea className='textarea' key={index} class="edit-field" onChange={(event) => handledit(event, index)} rows="15" value={el.pregunta} style={{fontFamily: "monospace"}} />
                  </div>
                  </div>
                  <div class="action-buttons" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px"}}>
                    <button class="btn btn-primary" onclick="guardarCambios('desarrollo2')">
                        <span class="material-icons">save</span>
                        Guardar cambios
                    </button>
                  </div>
                </div>  )
              }
            })}
            </>: 
            <>
            no hay datos de la prueba
            </>
        }
        </div>
    )
}


const Generated_tests = (props) => {
    const [detail, setDetail] = useState()
    const [lista, setLista] = useState([0])
    const [info, setInfo] = useState()
    const [search_test, setsearch_test] = useState('')
    const [search_cetegoria, setsearch_cetegoria] = useState('')
    const [search_candidato, setsearch_candidato] = useState('')
    const [search_mail, setsearch_mail] = useState('')
    const [filteredarray, setfilteredarray] = useState([])
    const { isAuthenticated, login, logout, user, userType } = useAuth()
    const obtenerLista = async () => {
        let response = await fetch(`/api/lista?mail=${user}`)
        if (response.ok){
            let data = await response.json()
            setLista(data.pruebas)
        }else{
            let data = await response.json()
            setInfo(data.message)
        }
    }

    const cerrar = () => {
        setDetail(0)
        console.log('cerrando detail')
    }

    useEffect(() => {
        console.log('CAmBIO EN DETAIL ES :', detail)
    },[detail])
    
    const cerrar2 = () => {
        props.main
    }

    useEffect(() => {
        obtenerLista()
    }, [])
    
    useEffect(() => {
      if(search_test.length > 0 || search_candidato.length > 0 || search_cetegoria.length > 0 || search_mail.length > 0){
        const filtered = lista.filter(item => {
          const config = JSON.parse(item.config)
          if(search_candidato.length > 0){
            return config.candidato.includes(search_candidato)
          }
          if(search_cetegoria.length > 0){
            return config.interviewType.includes(search_cetegoria)
          }
          if(search_test.length > 0){
            return item.id.includes(search_test)
          }
          if(search_mail.length > 0){
            return config.emailCandidato.includes(search_mail)
          }
        })
        setfilteredarray(filtered)
      }
      if(search_test.length == 0 && search_candidato.length == 0 && search_cetegoria.length == 0 && search_mail.length == 0){
        const filtered = 0
        setfilteredarray(filtered)
      }
    }, [search_test, search_candidato, search_cetegoria, search_mail])
    
    return(
        <div>
        {
            detail ? 
            <>
            <Detail cerrar={cerrar}  main={cerrar2} data={detail}/>
            </> : <>
            {
                info ? <div>Error al acceder a tados: {info}</div> : <>
                <div class="search-section">
            <div class="search-header">
                <h2>
                    <span class="material-icons">search</span>
                    Búsqueda de Pruebas
                </h2>
            </div>
            <div class="search-grid">
                <div class="search-field">
                    <label class="search-label">ID de Prueba</label>
                    <div class="search-input-wrapper">
                        <span class="material-icons">tag</span>
                        <input type="text" 
                        value={search_test}
                        onChange={(e) => setsearch_test(e.target.value)}
                               placeholder="Ej: TEST001" 
                               onkeyup="filterTests()"
                               class="search-input monospace"/>
                    </div>
                </div>
                <div class="search-field">
                    <label class="search-label">Categoría</label>
                    <div class="search-input-wrapper">
                        <span class="material-icons">category</span>
                        <input type="text"
                        value={search_cetegoria}
                        onChange={(e) => setsearch_cetegoria(e.target.value)}
                               placeholder="Frontend, Backend, FullStack..." 
                               onkeyup="filterTests()"
                               class="search-input"/>
                        <div class="search-suggestions" id="categorySuggestions"></div>
                    </div>
                </div>
                <div class="search-field">
                    <label class="search-label">Candidato</label>
                    <div class="search-input-wrapper">
                        <span class="material-icons">person</span>
                        <input type="text" 
                              value={search_candidato}
                              onChange={(e) => setsearch_candidato(e.target.value)}
                               placeholder="Nombre del candidato" 
                               onkeyup="filterTests()"
                               class="search-input"/>
                    </div>
                </div>
                <div class="search-field">
                    <label class="search-label">Email</label>
                    <div class="search-input-wrapper">
                        <span class="material-icons">mail</span>
                        <input type="text" 
                              value={search_mail}
                              onChange={(e)=> setsearch_mail(e.target.value)}
                               placeholder="email@ejemplo.com" 
                               onkeyup="filterTests()"
                               class="search-input"/>
                    </div>
                </div>
            </div>
            </div>
                {
                  filteredarray.length > 0 ? 
                  <>
                  {
                    <table class="tests-table">
                    <thead>
                        <tr>
                            <th>ID Prueba</th>
                            <th>Categoría</th>
                            <th>Nivel</th>
                            <th>Tiempo</th>
                            <th>Candidato</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        filteredarray.map((test, index) => {
                            let config = JSON.parse(test.config)
                            let category = config.interviewType
                            let level = config.interviewLevel
                            let time = config.time
                            let name = config.candidato
                            let email = 'no provisto'
                            return(
                            <tr key={index} class="test-row">
                                <td>{test.id}</td>
                                <td><span class="badge badge-category">{category}</span></td>
                                <td><span class="badge badge-level">{level}</span></td>
                                <td><span class="badge badge-time">{time}</span></td>
                                <td>
                                <div class="candidate-info" >
                                    <span class="candidate-name">{name}</span>
                                    <span class="candidate-email">{config.emailCandidato || 'Email no provisto'}</span>
                                </div>
                                </td>
                                <td>
                                    <button class="btn-view" onClick={(e) => {setDetail(test)}}>
                                        <span class="material-icons">visibility</span>
                                        Ver Prueba
                                    </button>
                                </td>
                            </tr>)
                        })
                    }</tbody></table>
                  }
                  </>
                  :
                  <>
                {
                    lista.length > 0 && lista[0] != 0  ? 
                    (
                    <table class="tests-table">
                    <thead>
                        <tr>
                            <th>ID Prueba</th>
                            <th>Categoría</th>
                            <th>Nivel</th>
                            <th>Tiempo</th>
                            <th>Candidato</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        lista.map((test, index) => {
                            let config = JSON.parse(test.config)
                            let category = config.interviewType
                            let level = config.interviewLevel
                            let time = config.time
                            let name = config.candidato
                            let email = 'no provisto'
                            return(
                            <tr key={index} class="test-row">
                                <td>{test.id}</td>
                                <td><span class="badge badge-category">{category}</span></td>
                                <td><span class="badge badge-level">{level}</span></td>
                                <td><span class="badge badge-time">{time}</span></td>
                                <td>
                                <div class="candidate-info" >
                                    <span class="candidate-name">{name}</span>
                                    <span class="candidate-email">{config.emailCandidato || 'Email no provisto'}</span>
                                </div>
                                </td>
                                <td>
                                    <button class="btn-view" onClick={(e) => {setDetail(test)}}>
                                        <span class="material-icons">visibility</span>
                                        Ver Prueba
                                    </button>
                                </td>
                            </tr>)
                        })
                    }</tbody></table>) : <>
                    {
                     lista.length == 0 && lista[0] != 0 ? 
                     <>No hay examenes generados</> 
                     : <Loader/> 
                    }
                    </>
                }
                </>
              }
                </>
            }
            </>
        }
        </div>
    )
}

export default Generated_tests