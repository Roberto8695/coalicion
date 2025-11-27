# Sistema de Autenticación Frontend - Coalición

## ✅ Implementación Completada

### 🔧 **Archivos Creados/Modificados**

#### 1. **Servicio de Autenticación** (`src/api/auth.ts`)
- Conexión con API del backend
- Métodos para login, logout, obtener perfil
- Gestión de tokens JWT en localStorage
- Verificación de roles y permisos

#### 2. **Hook de Autenticación** (`src/hooks/useAuth.tsx`)
- Context Provider para estado global de autenticación
- Hook `useAuth()` para componentes
- Hook `usePermissions()` para verificar roles
- Gestión de cookies para middleware

#### 3. **Componentes Actualizados**
- **FormLogin.tsx**: Conectado con el servicio de autenticación real
- **Login Page**: Simplificado para usar el nuevo sistema
- **Layout.tsx**: Incluye AuthProvider

#### 4. **Configuración API** (`src/api/config.ts`)
- Interceptor automático para incluir tokens JWT
- Manejo de errores centralizado

#### 5. **Middleware** (`src/middleware.ts`)
- Protección de rutas del dashboard
- Verificación de tokens en cookies
- Redirección automática al login

## 🔐 **Credenciales del Sistema**

### Usuarios Disponibles:
1. **Administrador**
   - Email: `admin@coalicion.bo`
   - Password: `admin123`
   - Rol: `administrador`

2. **Editor**
   - Email: `editor@coalicion.bo`
   - Password: `editor123`
   - Rol: `editor`

3. **Lector**
   - Email: `lector@coalicion.bo`
   - Password: `lector123`
   - Rol: `lector`

## 🚀 **Funcionalidades Implementadas**

### ✅ **Autenticación**
- Login con email y contraseña
- Tokens JWT con expiración (24h)
- Logout automático en caso de token expirado
- Persistencia de sesión con localStorage y cookies

### ✅ **Autorización**
- Verificación de roles por usuario
- Permisos específicos por funcionalidad:
  - Solo **administradores** pueden: crear/editar/eliminar contenido
  - Solo **administradores** pueden: gestionar usuarios
  - Todos pueden: ver contenido público

### ✅ **Protección de Rutas**
- Middleware que protege `/dashboard`
- Redirección automática al login si no está autenticado
- Mensajes de error informativos

### ✅ **Gestión de Estado**
- Context API para estado global
- Hooks personalizados para facilitar uso
- Verificación automática de sesión al cargar

## 📡 **Integración Backend-Frontend**

### **API Endpoints Utilizados:**
- `POST /api/usuarios/login` - Autenticación
- `GET /api/usuarios/profile` - Obtener perfil
- `PUT /api/usuarios/change-password/:id` - Cambiar contraseña

### **Headers Automáticos:**
```javascript
Authorization: Bearer {jwt_token}
```

### **Gestión de Errores:**
- Tokens expirados → Logout automático
- Errores de red → Mensajes informativos
- Usuarios inactivos → Acceso denegado

## 🎯 **Próximos Pasos**

### Pendientes para completar la integración:
1. **Dashboard Components**: Actualizar componentes del dashboard para usar `useAuth()` y `usePermissions()`
2. **Formularios CRUD**: Conectar formularios de creación/edición con endpoints del dashboard (`/api/.../dashboard`)
3. **Gestión de Usuarios**: Crear interfaz para que administradores gestionen usuarios
4. **Cambio de Contraseña**: Implementar formulario de cambio de contraseña
5. **Perfil de Usuario**: Crear página de perfil con información del usuario

### Rutas del Dashboard a Implementar:
- `/dashboard/usuarios` - Gestión de usuarios (solo admin)
- `/dashboard/publicaciones` - CRUD publicaciones (solo admin)
- `/dashboard/perfil` - Perfil del usuario
- `/dashboard/configuracion` - Configuraciones (solo admin)

## 🔍 **Testing del Sistema**

Para probar el sistema:

1. **Acceder a** `http://localhost:3000/login`
2. **Usar credenciales** de cualquier usuario (admin/editor/lector)
3. **Verificar redirección** al dashboard
4. **Probar logout** y protección de rutas
5. **Verificar permisos** según el rol del usuario

## 🛡️ **Seguridad Implementada**

- ✅ Tokens JWT con expiración
- ✅ Hashing de contraseñas (bcrypt en backend)
- ✅ Validación de sesión en cada request
- ✅ Protección CSRF con SameSite cookies
- ✅ Verificación de roles en frontend y backend
- ✅ Limpieza automática de datos al logout