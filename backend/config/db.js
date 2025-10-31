const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Asegúrate de cargar las variables de entorno

// Configuración del Pool usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Opcional: Para verificar la conexión al iniciar la aplicación
pool.on('connect', () => {
    console.log('Cliente de PostgreSQL conectado');
});

module.exports = {
    pool,
    // Opcional: un método 'query' para usar directamente si lo prefieres
    query: (text, params) => pool.query(text, params), 
};