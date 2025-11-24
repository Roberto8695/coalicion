# CMS de Eventos - Coalición por la Transparencia

## Descripción
Se ha creado un sistema completo de gestión de eventos (CMS) que permite administrar talleres, capacitaciones, foros y debates desde el panel de administración.

## Estructura de la tabla de eventos

```sql
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('taller', 'capacitacion', 'foro', 'debate')),
    date TIMESTAMP WITH TIME ZONE,
    time VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    duration VARCHAR(50),
    capacity INTEGER,
    registrationUrl VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    organizer VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    image VARCHAR(255),
    requirements TEXT
);
```

## Pasos para configurar

### 1. Crear la tabla en la base de datos
Ejecutar el script SQL incluido en `backend/setup_eventos_table.sql`:

```bash
psql -h tu_host -U tu_usuario -d tu_database -f backend/setup_eventos_table.sql
```

### 2. Verificar que el backend esté ejecutándose
Asegúrate de que tu backend Node.js esté corriendo en el puerto 4000 (o el puerto configurado en `NEXT_PUBLIC_API_URL`).

### 3. Acceder al CMS de Eventos
1. Ve al panel de administración: `/dashboard`
2. Inicia sesión con tus credenciales
3. En el sidebar, selecciona "Eventos"

## Funcionalidades del CMS

### ✅ Gestión completa de eventos
- **Crear** nuevos eventos con todos los campos requeridos
- **Editar** eventos existentes
- **Eliminar** eventos (con confirmación)
- **Ver** detalles completos de cada evento

### ✅ Campos disponibles
- **Título** (requerido)
- **Tipo**: taller, capacitación, foro, debate (requerido)
- **Fecha y hora**: datetime picker + campo de texto adicional
- **Ubicación**: lugar del evento
- **Descripción**: descripción detallada
- **Duración**: duración del evento (texto libre)
- **Capacidad**: número máximo de participantes
- **Organizador**: quien organiza el evento
- **Estado**: upcoming, ongoing, completed, cancelled
- **URL de registro**: link para inscribirse
- **Slug**: URL amigable (generada automáticamente)
- **Imagen**: URL de imagen del evento
- **Requisitos**: requisitos para participar

### ✅ Características adicionales
- **Paginación** para manejar muchos eventos
- **Búsqueda** integrada
- **Validación** de campos requeridos
- **Generación automática** de slug basado en el título
- **Estados visuales** con colores diferentes para cada tipo y estado
- **Responsive** design para móviles y tablets

## Integración con AgendaElectoralSection

El componente `AgendaElectoralSection` en la página de recursos (`/recursos`) automáticamente mostrará los eventos creados desde el CMS. Los eventos se muestran en:

1. **Vista de calendario mensual** con eventos marcados por fecha
2. **Vista de lista** con eventos próximos
3. **Modal de detalles** cuando se hace clic en un evento

## Solución de problemas

### Si no aparecen los eventos en el frontend:
1. Verifica que el backend esté corriendo
2. Verifica la configuración de `NEXT_PUBLIC_API_URL` en el frontend
3. Revisa la consola del navegador para errores de API
4. Usa la página de prueba: `/test-eventos` para verificar conectividad

### Si hay errores al crear eventos:
1. Verifica que la tabla eventos existe en la base de datos
2. Asegúrate de que todos los campos requeridos estén llenos
3. Verifica que el slug sea único
4. Revisa los logs del backend para errores de base de datos

## Archivos modificados/creados

### Frontend:
- `src/app/components/cms/EventosCMS.jsx` - Componente principal del CMS
- `src/app/components/cms/index.js` - Exportación del nuevo componente
- `frontend/src/api/services.ts` - Tipo Evento actualizado
- `frontend/src/app/recursos/components/AgendaElectoralSection.tsx` - Mapeo actualizado
- `frontend/src/app/test-eventos/page.tsx` - Página de prueba

### Backend (ya existían):
- `backend/controllers/EventosController.js`
- `backend/repositories/EventosRepository.js`
- `backend/routes/eventos.js`

### Nuevos archivos:
- `backend/setup_eventos_table.sql` - Script para crear tabla con datos de prueba

## API Endpoints disponibles

- `GET /api/eventos` - Obtener todos los eventos (con paginación)
- `GET /api/eventos/:id` - Obtener evento por ID
- `POST /api/eventos` - Crear nuevo evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento
- `GET /api/eventos/upcoming` - Obtener eventos próximos
- `GET /api/eventos/status/:status` - Obtener eventos por estado
- `GET /api/eventos/search` - Buscar eventos

## Próximos pasos sugeridos

1. **Subida de imágenes**: Integrar con el sistema de uploads para imágenes de eventos
2. **Notificaciones**: Sistema de recordatorios para eventos próximos
3. **Registro de participantes**: Sistema para que usuarios se registren a eventos
4. **Integración con calendario**: Exportar eventos a Google Calendar, Outlook, etc.
5. **Sistema de feedback**: Permitir evaluaciones post-evento