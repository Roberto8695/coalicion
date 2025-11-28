# Configuración de URLs para Producción

## Problema
El error 404 ocurre porque el frontend desplegado en Vercel está intentando conectar al backend usando URLs relativas (`/api/usuarios`), que funcionan en local pero no en producción donde el frontend y backend están en dominios diferentes.

## Solución
Configurar correctamente las variables de entorno para que el frontend use la URL absoluta del backend.

## Pasos para Configurar

### 1. Obtener la URL del Backend en Render
- Ve a tu dashboard de Render
- Busca tu servicio de backend
- Copia la URL (ej: `https://coalicion-backend-abc123.onrender.com`)

### 2. Configurar Variables de Entorno en Vercel
- Ve a tu dashboard de Vercel
- Selecciona tu proyecto de frontend
- Ve a Settings > Environment Variables
- Agrega una nueva variable:
  - **Name**: `NEXT_PUBLIC_API_URL`
  - **Value**: `https://tu-backend-render-url.onrender.com/api` (reemplaza con tu URL real)
  - **Environment**: Selecciona Production, Preview y Development

### 3. Re-desplegar
Después de configurar las variables de entorno, re-despliega tu aplicación en Vercel para que tome los nuevos valores.

## Verificar la Configuración
Una vez desplegado, puedes verificar que la variable esté correcta:
- Abre las herramientas de desarrollador en tu sitio desplegado
- En la consola, ejecuta: `console.log(process.env.NEXT_PUBLIC_API_URL)`
- Debería mostrar la URL correcta de tu backend

## Estructura de URLs
- **Frontend (Vercel)**: `https://tu-app.vercel.app`
- **Backend (Render)**: `https://tu-backend.onrender.com`
- **API URL**: `https://tu-backend.onrender.com/api`

## Cambios Realizados en el Código
1. ✅ Creado servicio `UsuariosService` en `/src/api/services.ts`
2. ✅ Actualizado `UsuariosCMS.tsx` para usar el servicio en lugar de fetch directo
3. ✅ Configurado interceptor de autenticación en `/src/api/config.ts`
4. ✅ El servicio automáticamente usa `NEXT_PUBLIC_API_URL` para las llamadas al API

## Próximos Pasos
1. Configurar la variable `NEXT_PUBLIC_API_URL` en Vercel con tu URL real de Render
2. Re-desplegar la aplicación
3. Verificar que la gestión de usuarios funciona correctamente