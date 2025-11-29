# Configuración de Cloudinary - Instrucciones

## ¿Qué necesitas hacer?

### 1. Crear cuenta en Cloudinary
1. Ve a [cloudinary.com](https://cloudinary.com)
2. Crea una cuenta gratuita
3. Confirma tu email

### 2. Obtener las credenciales
Una vez en tu dashboard de Cloudinary:
1. Ve a la sección "Dashboard"
2. Encontrarás tres valores importantes:
   - **Cloud name**: Aparece arriba (ej: `dz1a2b3c4`)
   - **API Key**: Un número largo (ej: `123456789012345`)
   - **API Secret**: Una cadena alfanumérica (ej: `abcdef123456-XyZ789`)

### 3. Configurar variables de entorno

#### En tu archivo `.env` local (ya agregado):
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui  
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

#### En Render (tu servidor de backend):
1. Ve a tu dashboard de Render
2. Selecciona tu servicio de backend
3. Ve a "Environment" en el menú lateral
4. Agrega estas 3 variables:
   - `CLOUDINARY_CLOUD_NAME` = tu cloud name
   - `CLOUDINARY_API_KEY` = tu api key
   - `CLOUDINARY_API_SECRET` = tu api secret

### 4. Re-desplegar en Render
Después de agregar las variables de entorno en Render:
1. Render se redespliegue automáticamente
2. O puedes hacer "Manual Deploy" para forzar un nuevo despliegue

## ¿Qué cambia?

### Antes (filesystem local):
- Imágenes se guardaban en `/backend/uploads/`
- Se perdían con cada deployment de Render
- URLs eran: `https://tu-backend.com/uploads/imagen.jpg`

### Ahora (Cloudinary):
- Imágenes se guardan en la nube de Cloudinary
- Persisten para siempre (o hasta que las elimines)
- URLs son: `https://res.cloudinary.com/tu-cloud-name/image/upload/v123/coalicion/infografia/imagen-123.jpg`

## Verificar que funciona

### 1. Logs del servidor
Cuando inicies el servidor, deberías ver:
```
☁️ Cloudinary configurado: tu_cloud_name
```

Si ves `☁️ Cloudinary configurado: No configurado`, significa que falta la variable `CLOUDINARY_CLOUD_NAME`.

### 2. Subir una imagen
- Ve a tu CMS de publicaciones de coalición
- Intenta crear/editar una publicación con imagen
- En los logs deberías ver: `📷 Imagen subida a Cloudinary: https://res.cloudinary.com/...`

### 3. En tu dashboard de Cloudinary
- Ve a "Media Library"
- Deberías ver las imágenes organizadas en carpetas: `coalicion/infografia/`

## Beneficios

✅ **Imágenes persistentes**: No se pierden con deployments
✅ **CDN global**: Carga rápida desde cualquier lugar del mundo
✅ **Optimización automática**: Cloudinary optimiza las imágenes automáticamente
✅ **Transformaciones**: Puedes redimensionar/optimizar en tiempo real
✅ **Backup automático**: Cloudinary mantiene tus archivos seguros

## Estructura de carpetas en Cloudinary

```
coalicion/
├── infografia/          # Imágenes de publicaciones de coalición
├── multimedia/          # Contenido multimedia general  
├── arte/               # Recursos de arte
├── presentaciones/     # PDFs y presentaciones
├── videos/             # Videos
└── general/            # Otros archivos
```

## Importante

- 🔐 **Nunca compartas tu API Secret** - manténlo privado
- 💾 **Plan gratuito**: 25GB de almacenamiento y 25GB de ancho de banda mensual
- 🗑️ **Eliminación**: Cuando elimines publicaciones, las imágenes también se eliminan de Cloudinary automáticamente

## Si algo falla

1. Verifica que las 3 variables estén configuradas correctamente
2. Revisa los logs del servidor en Render
3. Verifica que las credenciales sean correctas en tu dashboard de Cloudinary
4. Asegúrate de que la cuenta de Cloudinary esté activa

¡Una vez configurado, tendrás un sistema de gestión de imágenes robusto y escalable! 🚀