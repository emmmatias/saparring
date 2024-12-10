const SidebarEmpresa = (props) => {

    return(
        <nav class="sidebar">
        <div class="sidebar-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
            </svg>
            <h1>Sparring Labs</h1>
        </div>

        <div class="sidebar-menu">
            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">dashboard</span>
                    Dashboard
                </h2>
                <ul class="menu-items">
                    <li><a href="/admin" class="menu-item active">Inicio</a></li>
                </ul>
            </div>

            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">business</span>
                    Empresas
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.alta} class="menu-item">Gestionar mi perfil</a></li>
                </ul>
            </div>

            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">assignment</span>
                    Pruebas
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.generarConsulta} class="menu-item">Generar Prueba</a></li>
                    <li><a onClick={props.abrirHistorial} class="menu-item">Listado de Pruebas</a></li>
                    <li><a onClick={props.abrirFeedbacks} class="menu-item">Listado de Feedbacks</a></li>
                </ul>
            </div>

            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">groups</span>
                    Talento
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.toComming} class="menu-item">Talent Mapping</a></li>
                    <li><a onClick={props.toComming} class="menu-item">Búsqueda de Talento</a></li>
                </ul>
            </div>

            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">settings</span>
                    Configuración
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.message_config} class="menu-item">Configurador de Mensajes de Pruebas</a></li>
                </ul>
            </div>

            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">analytics</span>
                    Análisis
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.toComming} class="menu-item">KPIs</a></li>
                </ul>
            </div>

            
            <div class="menu-section">
                <h2 class="menu-section-title">
                    <span class="material-icons category-icon">gavel</span>
                    Legal
                </h2>
                <ul class="menu-items">
                    <li><a onClick={props.toComming} class="menu-item">Configurador Legal</a></li>
                    <li><a onClick={props.toComming} class="menu-item">Términos y Condiciones</a></li>
                    <li><a onClick={props.toComming} class="menu-item">Configurador de Contacto</a></li>
                </ul>
            </div>
        </div>
    </nav>
    )
}

export default SidebarEmpresa

