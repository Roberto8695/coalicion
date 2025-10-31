const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Asegúrate de cargar las variables de entorno

// Configuración del Pool usando variables de entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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