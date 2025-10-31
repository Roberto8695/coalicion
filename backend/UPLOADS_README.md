# Sistema de Uploads - Coalición

## Características Implementadas

### 📁 Estructura de Carpetas
- `/uploads/` - Carpeta principal de archivos
  - `/infografia/` - Infografías (PDF, JPG, PNG, SVG)
  - `/video/` - Videos (MP4, AVI, MOV, MKV)
  - `/arte/` - Arte digital (JPG, PNG, SVG, GIF)
  - `/presentacion/` - Presentaciones (PDF, PPT, PPTX)
  - `/thumbnails/` - Miniaturas
  - `/previews/` - Vistas previas

### 🚀 Funcionalidades

#### Backend
- **Subida de archivos** con validación por tipo
- **Detección automática** de tamaño y formato
- **Organización automática** por tipo y extensión
- **API endpoints**:
  - `POST /api/uploads/file` - Subir archivo principal
  - `POST /api/uploads/thumbnail` - Subir miniatura/vista previa
  - `GET /api/uploads/files` - Listar archivos disponibles
  - `DELETE /api/uploads/files/:filepath` - Eliminar archivo

#### Frontend
- **Componente FileUpload** - Subida con drag & drop
- **Componente FilePicker** - Selección de archivos existentes
- **Auto-completado** de metadatos (tamaño, formato, slug)
- **Preview** de imágenes en tiempo real
- **Validación** de tipos de archivo

## 🎯 Cómo Usar

### 1. Crear Nuevo Multimedia

1. Ve al **Dashboard** → **Gestión de Multimedia**
2. Haz clic en **"Nuevo Multimedia"**
3. Selecciona el **Tipo** (infografía, video, arte, presentación)
4. **Sube el archivo principal**:
   - Arrastra el archivo o haz clic para seleccionar
   - Se auto-completarán: tamaño, formato, slug
5. **Agrega miniatura** (opcional):
   - Sube una nueva imagen
   - O selecciona una existente
6. **Agrega vista previa** (opcional):
   - Sube una nueva imagen
   - O selecciona una existente
7. Completa la información adicional
8. Haz clic en **"Crear"**

### 2. Tipos de Archivos Soportados

| Tipo | Formatos Permitidos | Tamaño Máximo |
|------|-------------------|---------------|
| **Infografía** | PDF, JPG, PNG, SVG | 100MB |
| **Video** | MP4, AVI, MOV | 100MB |
| **Arte** | JPG, PNG, SVG, GIF | 100MB |
| **Presentación** | PDF, PPT, PPTX | 100MB |
| **Miniatura/Preview** | JPG, PNG, SVG | 10MB |

### 3. Auto-completado

Al subir un archivo, se completan automáticamente:
- ✅ **Tamaño**: Detectado del archivo
- ✅ **Formato**: Extensión del archivo
- ✅ **Slug**: Generado del nombre del archivo
- ✅ **Nombre del archivo**: Para referencia interna

## 🔧 Configuración Técnica

### Variables de Entorno
```bash
# Backend
PORT=4000
DB_USER=tu_usuario
DB_HOST=localhost
DB_DATABASE=coalicion_db
DB_PASSWORD=tu_password
DB_PORT=5432

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Dependencias Agregadas
```bash
# Backend
npm install multer mime-types file-type

# Frontend - Ya incluidas en el proyecto
```

## 📝 Notas Importantes

1. **Validación de archivos**: Solo se permiten tipos específicos según la categoría
2. **Organización automática**: Los archivos se organizan en subcarpetas por tipo y formato
3. **URLs del backend**: Los archivos se sirven desde `http://localhost:4000/uploads/`
4. **Fallback manual**: Puedes ingresar URLs manualmente si no quieres subir archivos
5. **Miniaturas opcionales**: Puedes usar archivos existentes o subir nuevos

## 🐛 Solución de Problemas

### Error: "Tipo de archivo no permitido"
- Verifica que el archivo tenga la extensión correcta
- Asegúrate de haber seleccionado el tipo correcto antes de subir

### Error: "Archivo muy grande"
- Verifica que el archivo no exceda los límites (100MB para archivos principales, 10MB para imágenes)

### Error: "No se puede subir archivo"
- Verifica que el backend esté ejecutándose
- Revisa que las carpetas uploads tengan permisos de escritura

### Archivos no aparecen en FilePicker
- Verifica que los archivos estén en las carpetas correctas
- Reinicia el backend si es necesario