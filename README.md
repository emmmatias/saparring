# SST - Simulador de Sparring Técnico

## Descripción del Proyecto

El Simulador de Entrevistas Técnicas es una aplicación web desarrollada con Next.js que ayuda a los desarrolladores y profesionales de TI a prepararse para entrevistas técnicas. La aplicación simula entrevistas en diversas áreas de tecnología, proporcionando preguntas personalizadas y feedback detallado.

## Versión 0.1

### Características principales

- **Entrevistas técnicas en 11 campos de tecnología**: Capacidad para gestionar entrevistas en diversos campos de desarrollo e IT.
- **Tecnologías personalizables**: Desglosa campos en tecnologías específicas, permitiendo añadirlas con etiquetas.
- **Análisis de ofertas de trabajo**: Extrae automáticamente el stack tecnológico y nivel requerido de una descripción de trabajo pegada.
- **Preguntas adaptativas**: Genera preguntas basadas en el nivel y stack tecnológico especificados.
- **Feedback detallado**: Proporciona un informe de retroalimentación descargable en PDF.

### Changelog

#### v0.1.0 

- Implementación inicial del sistema de entrevistas técnicas.
- Soporte para 11 campos tecnológicos principales en empresas de desarrollo e IT.
- Funcionalidad de etiquetado para tecnologías específicas dentro de cada campo.
- Desarrollo del analizador de ofertas de trabajo para extraer requisitos técnicos.
- Integración de IA para generación de preguntas adaptadas al nivel y stack tecnológico.
- Creación del sistema de feedback con opción de descarga en PDF.
- Interfaz de usuario básica para interacción con el simulador.

### Próximos pasos

- Implementar la elección del número de preguntas por entrevista.
- Añadir nuevos tipos de preguntas:
  - Preguntas de opción múltiple (test).
  - Ejercicios de solución de código.
  - Identificación de errores en fragmentos de código.
  - Integración de tecnología de voz a texto para respuestas orales.
- Optimizar la generación de preguntas para una mayor variedad y precisión.
- Desarrollar una interfaz de usuario más intuitiva y responsive.

## Características Principales

- Simulación de entrevistas técnicas en múltiples áreas de TI
- Preguntas personalizadas basadas en el nivel de experiencia y especialización del usuario
- Feedback detallado después de cada sesión de simulación
- Interfaz de usuario intuitiva desarrollada con Material-UI
- Formulario de contacto con CAPTCHA simple para prevenir spam

## Tecnologías Utilizadas

- Next.js
- React
- Material-UI
- Node.js
- OpenAI API (para generación de preguntas)
- Nodemailer (para envío de emails)

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/entrevista-tech-mvp.git
   cd entrevista-tech-mvp
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables de entorno:
   ```
   OPENAI_API_KEY=tu_clave_api_de_openai
   SMTP_SERVER=tu_servidor_smtp
   SMTP_PORT=tu_puerto_smtp
   SMTP_USERNAME=tu_usuario_smtp
   SMTP_PASSWORD=tu_contraseña_smtp
   SENDER_EMAIL=email_del_remitente
   RECIPIENT_EMAIL=email_del_destinatario
   ```

## Ejecución

Para ejecutar el proyecto en modo de desarrollo:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Construcción para Producción

Para construir la aplicación para producción:

```bash
npm run build
# o
yarn build
```

Luego, para iniciar el servidor de producción:

```bash
npm start
# o
yarn start
```

## Estructura del Proyecto

- `pages/`: Contiene las páginas de la aplicación y las rutas API
- `components/`: Componentes reutilizables de React
- `styles/`: Estilos globales y temas de Material-UI
- `public/`: Archivos estáticos como imágenes y favicon

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar o añadir.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarnos a través del formulario de contacto en la aplicación o abriendo un issue en este repositorio.
