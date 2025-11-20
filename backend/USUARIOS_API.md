# API de Usuarios - Documentación

## Descripción
Sistema completo de gestión de usuarios con autenticación JWT y autorización basada en roles.

## Roles y Permisos
- **administrador**: 
  - ✅ Acceso completo al sistema
  - ✅ Puede crear, editar y eliminar publicaciones
  - ✅ Puede crear, editar y eliminar usuarios
  - ✅ Puede subir y gestionar archivos
  - ✅ Acceso a todas las estadísticas
- **editor**: 
  - ✅ Puede visualizar todas las publicaciones
  - ❌ NO puede crear, editar o eliminar publicaciones
  - ❌ NO puede gestionar usuarios
  - ❌ NO puede subir archivos
- **lector**: 
  - ✅ Puede visualizar todas las publicaciones
  - ❌ NO puede crear, editar o eliminar publicaciones
  - ❌ NO puede gestionar usuarios
  - ❌ NO puede subir archivos

## Sistema de Autorización

### Operaciones en Publicaciones (todos los tipos)
- **Lectura (GET)**: Todos los usuarios autenticados
- **Creación (POST)**: Solo administradores
- **Actualización (PUT)**: Solo administradores
- **Eliminación (DELETE)**: Solo administradores

### Gestión de Usuarios
- **Ver perfil propio**: Todos los usuarios autenticados
- **Cambiar contraseña propia**: Todos los usuarios autenticados
- **CRUD de usuarios**: Solo administradores
- **Estadísticas de usuarios**: Solo administradores

### Gestión de Archivos
- **Subir archivos**: Solo administradores
- **Ver archivos**: Todos los usuarios autenticados
- **Descargar archivos**: Todos los usuarios autenticados
- **Eliminar archivos**: Solo administradores

## Endpoints

### Rutas Públicas

#### Login
```
POST /api/usuarios/login
```
**Body:**
```json
{
  "correo": "admin@coalicion.bo",
  "password": "admin123"
}
```
**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "correo": "admin@coalicion.bo",
      "rol": "administrador",
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Rutas Protegidas (Requieren Token)

#### Obtener Perfil
```
GET /api/usuarios/profile
Headers: Authorization: Bearer {token}
```

#### Cambiar Contraseña
```
PUT /api/usuarios/change-password/:id
Headers: Authorization: Bearer {token}
```
**Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "nueva_password"
}
```

### Rutas de Administrador

#### Obtener Todos los Usuarios
```
GET /api/usuarios
Headers: Authorization: Bearer {token}
Query Parameters:
- page: número de página (default: 1)
- limit: registros por página (default: 10)
- rol: filtrar por rol (administrador, editor, lector)
- activo: filtrar por estado (true/false)
- search: buscar por nombre o correo
```

#### Obtener Usuario por ID
```
GET /api/usuarios/:id
Headers: Authorization: Bearer {token}
```

#### Crear Nuevo Usuario
```
POST /api/usuarios
Headers: Authorization: Bearer {token}
```
**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@coalicion.bo",
  "password": "password123",
  "rol": "editor"
}
```

#### Actualizar Usuario
```
PUT /api/usuarios/:id
Headers: Authorization: Bearer {token}
```
**Body:**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "correo": "juan.nuevo@coalicion.bo",
  "rol": "administrador",
  "activo": true
}
```

#### Eliminar Usuario (Soft Delete)
```
DELETE /api/usuarios/:id
Headers: Authorization: Bearer {token}
```

#### Activar/Desactivar Usuario
```
PATCH /api/usuarios/:id/toggle-active
Headers: Authorization: Bearer {token}
```

#### Obtener Estadísticas
```
GET /api/usuarios/stats
Headers: Authorization: Bearer {token}
```
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "activos": 4,
    "administradores": 1,
    "editores": 2,
    "lectores": 2,
    "nuevos_ultimo_mes": 3
  }
}
```

## Estructura de la Tabla

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'lector' CHECK (rol IN ('administrador', 'editor', 'lector')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Autenticación y Autorización

### JWT Token
- **Duración**: 24 horas
- **Secret**: Definido en `process.env.JWT_SECRET`
- **Header**: `Authorization: Bearer {token}`

### Middleware de Autenticación
- `authenticateToken`: Verifica que el token sea válido
- `authorizeRoles(['rol'])`: Verifica que el usuario tenga el rol requerido
- `requireAdmin`: Solo administradores
- `requireEditor`: Administradores y editores
- `requireOwnershipOrAdmin`: El mismo usuario o administrador

## Seguridad

### Contraseñas
- **Hashing**: bcrypt con salt rounds = 10
- **Mínimo**: 6 caracteres
- Las contraseñas nunca se devuelven en las respuestas

### Validaciones
- Correo único en el sistema
- Formato de correo válido
- Roles válidos únicamente
- Usuarios activos para login

## Uso de Ejemplo

### 1. Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@coalicion.bo","password":"admin123"}'
```

### 2. Crear Usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"nombre":"Editor Test","correo":"editor@test.com","password":"123456","rol":"editor"}'
```

### 3. Obtener Usuarios
```bash
curl -X GET "http://localhost:3000/api/usuarios?page=1&limit=5&rol=editor" \
  -H "Authorization: Bearer {token}"
```

## Usuario por Defecto

Al crear la tabla se inserta automáticamente un usuario administrador:
- **Email**: admin@coalicion.bo
- **Password**: admin123
- **Rol**: administrador

⚠️ **Importante**: Cambiar la contraseña por defecto en producción.

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado
- **400**: Error de validación
- **401**: No autenticado
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **500**: Error interno del servidor