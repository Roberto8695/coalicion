const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Asegúrate de cargar las variables de entorno

// Configuración del Pool usando variables de entorno
const sslEnabled = ['true', '1', 'yes'].includes(String(process.env.DB_SSL || '').toLowerCase());
const rejectUnauthorized = !['false', '0', 'no'].includes(
    String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase()
);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    // SSL solo en producción
    ssl: sslEnabled ? { rejectUnauthorized } : false
});

// Opcional: Para verificar la conexión al iniciar la aplicación
pool.on('connect', () => {
    console.log(`✅ Cliente de PostgreSQL conectado (${process.env.NODE_ENV})`);
    console.log(`📊 Base de datos: ${process.env.DB_DATABASE} en ${process.env.DB_HOST}`);
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en cliente PostgreSQL:', err);
});

module.exports = {
    pool,
    // Opcional: un método 'query' para usar directamente si lo prefieres
    query: (text, params) => pool.query(text, params), 
};
