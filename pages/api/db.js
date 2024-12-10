import mysql from 'mysql2/promise';

let connection;

if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
        host: process.env.MYSQLHOSTING,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASS,
        database: process.env.MYSQLDATABASE,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
    });
}

connection = global._mysqlPool;

async function createTables() {
    try {
        await connection.query(`CREATE TABLE IF NOT EXISTS pruebas (
            id VARCHAR(20) PRIMARY KEY,
            mail VARCHAR(255),
            config LONGTEXT,
            preguntas LONGTEXT,
            abierta BOOLEAN DEFAULT TRUE
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS empresas (
            id TEXT,
            empresa TEXT,
            cif VARCHAR(30) UNIQUE,
            direccion TEXT,
            codigopostal TEXT,
            provincia TEXT,
            ciudad TEXT,
            telefono_contacto TEXT,
            email_contacto TEXT,
            email_admin TEXT,
            logo LONGTEXT,
            web TEXT,
            reclutadores LONGTEXT,
            activo BOOLEAN,
            mail_verificado BOOLEAN,
            contraseña TEXT
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS candidatos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre TEXT,
            apellido TEXT,
            puesto TEXT,
            tecnologias TEXT,
            situacion TEXT,
            oferta TEXT,
            mail VARCHAR(50) NOT NULL UNIQUE,
            contraseña TEXT,
            pruebas TEXT,
            feedbacks TEXT,
            autorizado BOOLEAN,
            mail_verificado BOOLEAN,
            config TEXT
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS respuestas (
            id_respuesta TEXT,
            id_prueba TEXT,
            tiempo_prueba INT,
            mail TEXT,
            respuestas LONGTEXT,
            feedbacks LONGTEXT,
            inicio DATETIME,
            termino DATETIME,
            puntaje_final INT
        )`);

        console.log("Tablas creadas o ya existentes.");
    } catch (error) {
        console.error("Error al crear las tablas:", error);
    }
}

await createTables()

export default connection