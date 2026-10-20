const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
}

const app = express();
const port = Number(process.env.PORT || 4000);
const host = '0.0.0.0';
const { pool } = require('./config/db');

app.use(express.json());

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? configuredOrigins
    : [...configuredOrigins, 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
            return callback(null, true);
        }
        const error = new Error('Origin is not allowed by CORS');
        error.status = 403;
        return callback(error);
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    const fileExtension = path.extname(req.path).toLowerCase();
    const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'];
    if (downloadableExtensions.includes(fileExtension)) {
        res.header('Content-Disposition', 'attachment');
    }
    next();
}, express.static(path.join(__dirname, 'uploads')));

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('PostgreSQL health check failed:', error.message);
        res.status(503).json({ status: 'unavailable' });
    }
});

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend de Coalicion funcionando correctamente',
        version: '1.0.0',
        api: { base: '/api', documentation: '/api' }
    });
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: 'Conexion a base de datos exitosa',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connectivity test failed:', error.message);
        res.status(500).json({ success: false, error: 'Error de conexion a la base de datos' });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.originalUrl,
        method: req.method
    });
});

app.use((error, req, res, next) => {
    console.error('Unhandled request error:', error.message);
    const status = error.status || 500;
    res.status(status).json({
        success: false,
        message: status === 403 ? 'Origen no permitido' : 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

const server = app.listen(port, host, () => {
    console.log(`Server listening on ${host}:${port}`);
    console.log(`API available at http://localhost:${port}/api`);
});

let shuttingDown = false;
const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received; shutting down`);

    server.close(async () => {
        try {
            await pool.end();
            process.exit(0);
        } catch (error) {
            console.error('Shutdown failed:', error.message);
            process.exit(1);
        }
    });

    setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
