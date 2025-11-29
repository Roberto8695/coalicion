# Configuración de URLs para Producción

## Problema
El error 404 y 500 ocurre porque el frontend desplegado en Vercel está teniendo problemas de configuración con el backend en Render.

## Errores identificados:

1. **Error 404 en imagen**: `GET https://coalicion-two.vercel.app/_next/image?url=https%3A%2F%2Fcoalicion.onrender.com%2Fuploads%2F... 404`
2. **Error 500**: `PUT https://coalicion.onrender.com/api/publicaciones-coalicion/dashboard/7/upload 500`
3. **Runtime errors**: Extensiones del navegador interfiriendo

## Solución

### 1. Obtener la URL del Backend en Render
- Ve a tu dashboard de Render
- Busca tu servicio de backend
- Copia la URL exacta (ej: `https://coalicion-backend-abc123.onrender.com`)

### 2. Configurar Variables de Entorno en Vercel
- Ve a tu dashboard de Vercel
- Selecciona tu proyecto de frontend
- Ve a Settings > Environment Variables
- Agrega una nueva variable:
  - **Name**: `NEXT_PUBLIC_API_URL`
  - **Value**: `https://TU-BACKEND-RENDER-URL.onrender.com/api`
  - **Environment**: Selecciona Production, Preview y Development

### 3. Ejemplo de configuración correcta:
```
NEXT_PUBLIC_API_URL=https://coalicion.onrender.com/api
```

### 4. Re-desplegar
Después de configurar las variables de entorno:
1. Ve a tu proyecto en Vercel
2. Ve a la pestaña "Deployments"
3. Haz clic en "Redeploy" en el último deployment

### 5. Verificar la Configuración
Una vez desplegado, puedes verificar:
1. Abre las herramientas de desarrollador en tu sitio desplegado
2. En la consola, deberías ver logs como:
   ```
   🔧 API Configuration Debug:
   API_BASE_URL: https://coalicion.onrender.com/api
   BACKEND_BASE_URL: https://coalicion.onrender.com
   NEXT_PUBLIC_API_URL: https://coalicion.onrender.com/api
   ```

## Debugging adicional

### Para verificar las URLs:
- Los logs de la consola mostrarán las URLs que se están construyendo
- Busca mensajes que empiecen con 🔧, 🚀, ✅, ❌, 🖼️

### Problemas comunes:
1. **Variable no configurada**: Verás `undefined` en los logs
2. **URL incorrecta**: Verás la URL mal formada en los logs
3. **CORS**: Si el backend no permite requests desde tu dominio de Vercel

### Next Steps después de configurar:
1. ✅ Configurar `NEXT_PUBLIC_API_URL` en Vercel
2. ✅ Re-desplegar la aplicación  
3. ✅ Verificar logs en la consola
4. ✅ Probar actualización de publicaciones

## Estado actual del código:
- ✅ Logging mejorado para debugging
- ✅ Manejo de errores de imágenes
- ✅ Interceptors de Axios con debugging
- ✅ URLs de assets corregidas