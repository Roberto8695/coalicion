# Proyecto Coalición

Este documento proporciona una visión general del proyecto "Coalición", un monorepo que contiene una aplicación backend y una aplicación frontend separadas, diseñado para funcionar como una aplicación web completa.

## Visión General del Proyecto

"Coalición" es una aplicación web full-stack con una arquitectura desacoplada. El backend actúa como una API RESTful, mientras que el frontend es una aplicación de página única (SPA) generada estáticamente que consume esta API. La presencia de migraciones de base de datos, autenticación de usuarios y almacenamiento de archivos sugiere que probablemente se trate de un Sistema de Gestión de Contenidos (CMS), un portal web o una aplicación similar que requiere persistencia de datos y contenido generado por el usuario.

## Estructura del Proyecto

El proyecto está organizado en una estructura de monorepo con los siguientes directorios principales:

-   `backend/`: Contiene todo el código y la configuración de la aplicación del lado del servidor (API).
-   `frontend/`: Contiene todo el código y la configuración de la aplicación del lado del cliente (interfaz de usuario).
-   `render.yaml`: Archivo de configuración para el despliegue en la plataforma Render.
-   `.env.example`: Archivo de ejemplo para las variables de entorno.
-   Otros archivos `.md`: Documentación adicional sobre la configuración de Cloudinary, URLs, despliegue, etc.

## Tecnologías Utilizadas

### Backend

-   **Lenguaje:** JavaScript (Node.js)
-   **Framework:** Express.js
-   **Base de Datos:** PostgreSQL (con la dependencia `pg`)
-   **Autenticación:**
    -   `jsonwebtoken` (JWT) para la creación y verificación de tokens.
    -   `bcryptjs` para el cifrado de contraseñas.
-   **Carga de Archivos:** `multer` para el manejo de la carga de archivos, integrada con Cloudinary para el almacenamiento.
-   **Despliegue:** Configurado para ser desplegado como un servicio web de Node.js en la plataforma Render.
-   **Arquitectura:** Sigue patrones convencionales con `controllers`, `routes` y `repositories`, lo que sugiere una buena separación de responsabilidades.

### Frontend

-   **Framework:** Next.js (con React)
-   **Lenguaje:** TypeScript
-   **Estilos:** Tailwind CSS para un diseño rápido y responsivo.
-   **Comunicación con API:** `axios` para realizar peticiones HTTP al backend.
-   **Despliegue:** Configurado en `render.yaml` para ser desplegado como un sitio estático en la plataforma Render. Esto implica el uso de `next export` para generar archivos HTML, CSS y JavaScript estáticos que son luego servidos desde el directorio `./out`.

## Despliegue

El proyecto utiliza un archivo `render.yaml` para orquestar el despliegue en la plataforma Render. Se configuran dos servicios principales:

1.  **`coalicion-backend`:** Un servicio web de Node.js que ejecuta la aplicación backend.
2.  **`coalicion-frontend`:** Un servicio de sitio estático que sirve la aplicación frontend generada por Next.js.

## Cómo Empezar (Asunciones)

Para poner en marcha este proyecto localmente, necesitarías:

### Backend

1.  **Configuración de entorno:** Crear un archivo `.env` en el directorio `backend/` basado en `backend/.env.example` y configurar las variables necesarias (conexión a la base de datos, credenciales JWT, credenciales de Cloudinary, etc.).
2.  **Instalar dependencias:** Navegar al directorio `backend/` y ejecutar `npm install` o `yarn install`.
3.  **Base de Datos:** Asegurarse de tener una instancia de PostgreSQL ejecutándose y configurar las variables de entorno para la conexión. Podría ser necesario ejecutar migraciones si existen.
4.  **Iniciar el servidor:** Ejecutar `npm start` o `node server.js` desde el directorio `backend/`.

### Frontend

1.  **Configuración de entorno:** Crear un archivo `.env` en el directorio `frontend/` basado en `frontend/.env.example` y configurar las variables necesarias (ej. la URL base de la API del backend).
2.  **Instalar dependencias:** Navegar al directorio `frontend/` y ejecutar `npm install` o `yarn install`.
3.  **Iniciar la aplicación:** Ejecutar `npm run dev` para iniciar el servidor de desarrollo de Next.js.

---

Este `README.md` sirve como un punto de partida para entender el proyecto. Para un informe más detallado, se recomendaría profundizar en el código de cada componente, las rutas de la API, la lógica de los controladores y servicios del backend, así como los componentes y el manejo del estado del frontend.