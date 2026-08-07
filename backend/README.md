# Backend - Coalición API

Backend del sistema de gestión de contenido para la Coalición.

## 🚀 Configuración para Producción

### Variables de Entorno Requeridas

```bash
# Base de Datos PostgreSQL
DB_HOST=tu_host_de_base_datos
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_DATABASE=coalicion_db
DB_PORT=5432

# Configuración del Servidor
PORT=4000
NODE_ENV=production

# Frontend URL para CORS
FRONTEND_URL=https://tu-frontend-url.com

# Almacenamiento de archivos
# Usa "local" para guardar en el VPS con Coolify
STORAGE_PROVIDER=local
UPLOADS_DIR=uploads
```

### 📦 Despliegue en Coolify

1. **Conecta tu repositorio** a Coolify
2. **Configura las variables de entorno** en el servicio del backend
3. **Monta un volumen persistente** para la carpeta `uploads`
4. **Apunta `UPLOADS_DIR` al volumen** si usas una ruta distinta
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev      # Inicia con nodemon para hot reload

# Producción  
npm start        # Inicia el servidor en modo producción
npm run build    # Comando de build (no hace nada específico para Node.js)
```

### 📁 Estructura del Proyecto

```
backend/
├── config/          # Configuración de base de datos
├── controllers/     # Controladores de la API
├── repositories/    # Capa de acceso a datos
├── routes/          # Definición de rutas
├── uploads/         # Archivos subidos (idealmente montado como volumen)
├── server.js        # Punto de entrada
└── package.json     # Dependencias y scripts
```

### 🗄️ Base de Datos

El backend utiliza PostgreSQL. Asegúrate de:

1. Crear la base de datos
2. Ejecutar las migraciones/esquemas necesarios
3. Configurar las variables de entorno correctamente

### 🔒 Seguridad

- Variables de entorno para datos sensibles
- CORS configurado para frontend específico
- Validación de archivos en uploads
- Compatible con almacenamiento local en VPS o Cloudinary

### 📝 API Endpoints

- `GET /` - Health check
- `GET /api/publicaciones` - Obtener publicaciones
- `GET /api/noticias` - Obtener noticias
- `GET /api/eventos` - Obtener eventos
- `GET /api/multimedia` - Obtener archivos multimedia
- `POST /api/uploads/file` - Subir archivos
- Y más...