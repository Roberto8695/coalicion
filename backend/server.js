const express = require('express');
const { Pool } = require('pg'); // Se recomienda usar Pool para manejar conexiones
const dotenv = require('dotenv');
const cors = require('cors'); // Para permitir CORS si es necesario
const path = require('path');

dotenv.config(); // Carga las variables de entorno
const app = express();
const port = process.env.PORT || 4000; // Cambiar puerto por defecto

// Middlewares
app.use(express.json()); // Para parsear JSON en las peticiones

// Configuración de CORS mejorada para permitir descargas
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL, 
        'https://coalicion-frontend.onrender.com',
        'https://coalicion-frontend.vercel.app',
        'https://coalicion.vercel.app',
        /\.onrender\.com$/,
        /\.vercel\.app$/
      ]
    : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Servir archivos estáticos desde la carpeta uploads con headers adecuados
app.use('/uploads', (req, res, next) => {
    // Headers para permitir descargas y cacheo
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Disposition', 'attachment');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Verificar conexión a la base de datos
pool.on('connect', () => {
    console.log('✅ Cliente de PostgreSQL conectado');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en cliente PostgreSQL:', err);
    process.exit(-1);
});

// Importar rutas de la API
const apiRoutes = require('./routes');

// Configurar rutas
app.use('/api', apiRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Backend de Coalición funcionando correctamente',
        version: '1.0.0',
        database: process.env.DB_DATABASE,
        api: {
            base: '/api',
            documentation: '/api'
        }
    });
});

// Ruta de prueba para la base de datos
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            success: true,
            message: 'Conexión a base de datos exitosa',
            timestamp: result.rows[0].now,
            database: process.env.DB_DATABASE
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error de conexión a la base de datos',
            details: error.message
        });
    }
});

// Middleware para manejo de errores 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.originalUrl,
        method: req.method
    });
});

// Middleware para manejo de errores generales
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📊 Conectando a base de datos: ${process.env.DB_DATABASE}`);
    console.log(`📡 API disponible en: http://localhost:${port}/api`);
    console.log(`📖 Documentación en: http://localhost:${port}/api`);
});