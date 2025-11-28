# Instrucciones para Deploy en Render

## Backend (Node.js)

### Variables de entorno requeridas:
- `NODE_ENV`: production
- `PORT`: (se genera automáticamente)
- `DB_HOST`: tu_host_postgresql_render
- `DB_USER`: tu_usuario_postgresql
- `DB_PASSWORD`: tu_password_postgresql  
- `DB_DATABASE`: coalicion_db
- `DB_PORT`: 5432
- `FRONTEND_URL`: https://tu-frontend-url.vercel.app

### Configuración de Build:
- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: `./backend`

### Notas importantes:
1. **bcryptjs**: Se cambió de `bcrypt` a `bcryptjs` para mejor compatibilidad con Render
2. **Monorepo**: El backend está en `./backend/` - asegurar que Root Directory esté configurado
3. **PostgreSQL**: Crear base de datos PostgreSQL en Render y configurar variables de entorno

### Pasos para deploy:
1. Conectar repositorio GitHub a Render
2. Crear nuevo Web Service
3. Configurar Root Directory: `./backend`
4. Establecer Build Command: `npm install`
5. Establecer Start Command: `npm start`
6. Configurar todas las variables de entorno
7. Deploy

### Troubleshooting:
- Si falla `bcrypt`: Ya solucionado con `bcryptjs`
- Si no encuentra archivos: Verificar Root Directory
- Si falla conexión DB: Verificar variables de entorno PostgreSQL