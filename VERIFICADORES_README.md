# Configuración de Verificadores - Coalición

Este documento explica cómo configurar y usar el sistema de verificadores en la aplicación de la coalición.

## Estructura de Base de Datos

### Tabla `verificadores`

```sql
CREATE TABLE verificadores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('website', 'bot', 'api', 'tool') NOT NULL,
  url VARCHAR(500) NOT NULL,
  logo VARCHAR(500),
  features JSON,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Campos:

- **id**: Identificador único auto-incremental
- **name**: Nombre del verificador (requerido)
- **description**: Descripción del verificador
- **type**: Tipo de verificador (website, bot, api, tool)
- **url**: URL del verificador (requerido)
- **logo**: URL del logo del verificador
- **features**: Array JSON de características
- **isActive**: Si el verificador está activo
- **createdAt/updatedAt**: Timestamps de creación y actualización

## Backend API

### Endpoints Públicos
- `GET /api/verificadores/active` - Obtener verificadores activos
- `GET /api/verificadores/type/:type` - Obtener por tipo
- `GET /api/verificadores/search?q=query` - Buscar verificadores

### Endpoints de Dashboard (Requieren autenticación)
- `GET /api/verificadores/dashboard` - Listar todos
- `POST /api/verificadores/dashboard` - Crear nuevo
- `PUT /api/verificadores/dashboard/:id` - Actualizar
- `DELETE /api/verificadores/dashboard/:id` - Eliminar

### Estructura de Respuesta
```json
{
  "success": true,
  "message": "Verificadores obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Chequea Bolivia",
      "description": "Plataforma especializada en verificación de hechos y noticias en Bolivia.",
      "type": "website",
      "url": "https://chequeabolivia.bo/",
      "logo": "/logos/logo-chequea.webp",
      "features": ["Verificación en tiempo real", "Base de datos de noticias falsas"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Frontend

### Componentes

1. **VerificacionHechosSection** (`/src/app/recursos/components/VerificacionHechosSection.tsx`)
   - Muestra verificadores activos en la página pública
   - Conecta con el API para cargar datos dinámicamente
   - Tiene fallback a datos estáticos en caso de error

2. **VerificadoresCMS** (`/src/app/components/cms/VerificadoresCMS.tsx`)
   - Interfaz de administración para gestionar verificadores
   - CRUD completo con formularios intuitivos
   - Subida de logos
   - Filtros y búsqueda

### Servicios API

**VerificadoresService** (`/src/api/services.ts`)
```typescript
const verificadoresService = new VerificadoresService();

// Obtener verificadores activos
const activos = await verificadoresService.getActive();

// Obtener por tipo
const bots = await verificadoresService.getByType('bot');

// Buscar
const resultados = await verificadoresService.search('chequea');

// CRUD (requiere autenticación)
const nuevo = await verificadoresService.create(data);
const actualizado = await verificadoresService.update(id, data);
await verificadoresService.delete(id);
```

## Configuración

### 1. Ejecutar Script de Base de Datos

```bash
# Si estás usando MySQL
mysql -u usuario -p nombre_bd < backend/seed_verificadores.sql
```

### 2. Verificar Backend

Asegúrate de que el backend esté corriendo y que los endpoints respondan:

```bash
# Probar endpoint público
curl http://localhost:4000/api/verificadores/active

# Debería retornar verificadores activos
```

### 3. Verificar Frontend

1. La sección de verificación debería mostrar verificadores dinámicamente en `/recursos`
2. El CMS debería estar disponible en el dashboard para administradores

## Uso del CMS

### Acceso
1. Ir al dashboard (`/dashboard`)
2. Hacer clic en "Verificadores" en el sidebar
3. Se abre la interfaz de gestión

### Funcionalidades
- **Ver Lista**: Todos los verificadores con filtros
- **Agregar Nuevo**: Formulario para crear verificador
- **Editar**: Modificar verificadores existentes
- **Eliminar**: Remover verificadores
- **Subir Logo**: Upload de imágenes para logos
- **Filtros**: Por tipo, estado, búsqueda de texto

### Campos del Formulario
- **Nombre**: Nombre del verificador (requerido)
- **Descripción**: Descripción detallada (requerido)
- **Tipo**: website, bot, api, tool (requerido)
- **URL**: Enlace al verificador (requerido)
- **Logo**: URL o subir imagen
- **Características**: Lista separada por comas
- **Estado**: Activo/Inactivo

## Integración en Frontend Público

Los verificadores aparecen automáticamente en:
- `/recursos` - Sección "Verificación de Hechos"
- Carga dinámica desde la API
- Animaciones y efectos visuales
- Enlaces externos que se abren en nueva pestaña

## Tipos de Verificadores

1. **website**: Sitios web de verificación
2. **bot**: Bots de WhatsApp/Telegram
3. **api**: APIs para desarrolladores
4. **tool**: Herramientas especializadas

Cada tipo tiene:
- Icono específico
- Color diferente
- Comportamiento de enlace apropiado

## Mantenimiento

### Actualizar Verificadores
Use el CMS para mantener la información actualizada:
- Estados activo/inactivo
- URLs actualizadas
- Nuevas características
- Logos actualizados

### Backup
Los verificadores están almacenados en la base de datos MySQL, incluirlos en respaldos regulares.

### Monitoreo
Verificar periódicamente que:
- Los enlaces están funcionales
- Los logos cargan correctamente
- La API responde adecuadamente