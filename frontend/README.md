# Frontend - Coalición

Frontend de la aplicación de gestión de contenido para la Coalición.

## 🚀 Configuración para Producción

### Variables de Entorno

El proyecto está configurado para usar diferentes variables según el entorno:

**Desarrollo (`.env.local`)**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Producción (`.env.production`)**:
```bash
NEXT_PUBLIC_API_URL=https://coalicion.onrender.com/api
```

### 📦 Despliegue en Render

1. **Conecta tu repositorio** a Render
2. **Configura el servicio** como "Static Site"
3. **Build Command**: `npm run build`
4. **Publish Directory**: `.next`
5. **Variables de entorno**:
   - `NEXT_PUBLIC_API_URL=https://coalicion.onrender.com/api`

### 📦 Despliegue en Vercel (Recomendado para Next.js)

1. **Conecta tu repositorio** a Vercel
2. **Framework preset**: Next.js
3. **Variables de entorno**:
   - `NEXT_PUBLIC_API_URL=https://coalicion.onrender.com/api`

### 📦 Despliegue en Netlify

1. **Conecta tu repositorio** a Netlify
2. **Build Command**: `npm run build`
3. **Publish Directory**: `.next`
4. **Variables de entorno**:
   - `NEXT_PUBLIC_API_URL=https://coalicion.onrender.com/api`

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev       # Inicia servidor de desarrollo

# Producción
npm run build     # Construye la aplicación para producción
npm run start     # Inicia servidor de producción
npm run lint      # Ejecuta ESLint
```

### 🔧 Configuración Importante

#### Backend Connection
- La aplicación se conecta automáticamente al backend en `https://coalicion.onrender.com`
- Las imágenes y archivos estáticos se cargan desde el backend
- CORS está configurado para permitir conexiones desde dominios de Render y Vercel

#### Image Optimization
- Configurado para cargar imágenes desde el backend
- Soporte para dominios de Cloudinary
- Optimización automática de Next.js

### 🌐 URLs de Producción

- **Backend**: https://coalicion.onrender.com
- **Frontend**: [Tu URL de frontend una vez desplegado]

### 🔒 Seguridad

- Variables de entorno para configuración sensible
- HTTPS enforced en producción
- Image domains restricted

### 📁 Estructura del Proyecto

```
src/
├── api/              # Configuración de API y servicios
├── app/              # App Router de Next.js
│   ├── components/   # Componentes reutilizables
│   ├── dashboard/    # Panel de administración
│   └── [pages]/      # Páginas de la aplicación
├── data/             # Datos estáticos
└── middleware.ts     # Middleware de Next.js
```

### 🚨 Troubleshooting

#### Error de CORS
Si encuentras errores de CORS, verifica que:
1. El backend esté corriendo en https://coalicion.onrender.com
2. La variable `NEXT_PUBLIC_API_URL` esté configurada correctamente
3. El backend tenga tu dominio de frontend en la lista de orígenes permitidos

#### Imágenes no cargan
Si las imágenes no cargan:
1. Verifica que el backend esté sirviendo archivos desde `/uploads`
2. Confirma que el dominio esté en `next.config.ts` > `images.domains`

---

## Getting Started (Development)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
