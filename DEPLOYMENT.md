# Despliegue de Coalicion en Coolify

## Arquitectura elegida

El repositorio contiene dos aplicaciones y se despliega como una aplicacion Docker Compose desde Git:

- `frontend`: Next.js 15 en modo `standalone`, puerto interno `3000`.
- `backend`: Express 5 sobre Node.js, puerto interno `4000`.
- PostgreSQL: recurso de base de datos administrado por Coolify, fuera de este Compose y sin puerto publico.
- Archivos: volumen Docker `uploads-data` montado en `/app/uploads`.

Esta opcion mantiene una sola revision para frontend/backend y permite a Coolify enrutar cada dominio al servicio correcto. PostgreSQL se deja como recurso administrado para aprovechar su volumen y sus respaldos programados. No se debe publicar `3000`, `4000` ni `5432` en el firewall: Coolify enruta HTTP/HTTPS por `80/443` y la base se consume por la red privada.

## Hallazgos de la auditoria

- Frontend: TypeScript/JavaScript, App Router, scripts reales `npm run build` y `npm run start`, y `output: 'standalone'` ya configurado.
- Backend: JavaScript CommonJS, entrada `server.js`, script real `npm start`; no requiere compilacion.
- Gestor elegido: npm, porque `package-lock.json` esta versionado en ambas aplicaciones. Hay locks de pnpm no versionados; no deben mezclarse en CI.
- Node.js: se usa Node 22 en ambas imagenes. Cubre los requisitos de Next 15 y de las dependencias instaladas.
- PostgreSQL: acceso directo mediante `pg`, con `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER` y `DB_PASSWORD`.
- Autenticacion: JWT Bearer con roles; `JWT_SECRET` ahora es obligatorio en produccion.
- CORS: en produccion solo admite `CORS_ORIGINS` o `FRONTEND_URL`, sin comodines de proveedores.
- Persistencia: el backend sirve `/uploads` y guarda archivos localmente por defecto. El arbol existente esta en `backend/uploads` (aprox. 18 MB al auditarlo). La imagen no incorpora esos datos: deben copiarse al volumen.
- Almacenamiento alternativo: el codigo ya soporta Cloudinary mediante `STORAGE_PROVIDER=cloudinary`; no se activa por defecto.
- SQL: existen scripts de tablas, indices, funciones y triggers, ademas de columnas JSONB. Algunos scripts `reset_*` son destructivos y nunca se ejecutan automaticamente.
- Dependencias nativas: no se encontro ninguna dependencia directa que exija paquetes del sistema. `bcryptjs` es JavaScript puro.

## Archivos de produccion

- `frontend/Dockerfile`: build multietapa y runtime standalone sin root.
- `frontend/.dockerignore`: excluye dependencias, builds, secretos y archivos de desarrollo.
- `backend/Dockerfile`: instala solo dependencias de produccion y ejecuta como usuario `node`.
- `backend/.dockerignore`: excluye `.env`, uploads, SQL, pruebas y dependencias locales.
- `docker-compose.yml`: servicios, health checks y volumen persistente.
- `.env.coolify.example`: inventario sin secretos.

## Variables de entorno

### Frontend

| Variable | Momento | Obligatoria | Descripcion |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | build | si | URL publica completa del backend, terminada en `/api`, por ejemplo `https://api.example.com/api`. Se incorpora al bundle. |
| `BACKEND_INTERNAL_URL` | build | no | Destino del rewrite SSR. En Compose es `http://backend:4000`. |
| `PORT` | runtime | no | `3000` en la imagen. |
| `HOSTNAME` | runtime | no | `0.0.0.0` en la imagen. |

`NEXT_PUBLIC_STRAPI_URL` y `STRAPI_API_TOKEN` aparecen en el `.env.local` existente, pero no son leidos por el codigo auditado. No se deben copiar a produccion sin una necesidad comprobada; en particular, nunca se debe exponer un token mediante `NEXT_PUBLIC_*`.

### Backend

| Variable | Obligatoria | Descripcion |
| --- | --- | --- |
| `NODE_ENV` | si | `production`. |
| `PORT` | no | `4000`. |
| `FRONTEND_URL` | si | Origen HTTPS principal del frontend, sin slash final. |
| `CORS_ORIGINS` | no | Lista separada por comas para varios origenes exactos. Si esta vacia se usa `FRONTEND_URL`. |
| `JWT_SECRET` | si | Secreto largo y aleatorio. Cambiarlo invalida tokens activos. |
| `DB_HOST` | si | Host privado mostrado por el recurso PostgreSQL de Coolify; nunca `localhost`. |
| `DB_PORT` | si | Normalmente `5432`. |
| `DB_DATABASE` | si | Base de datos de la aplicacion. |
| `DB_USER` | si | Usuario de la aplicacion. |
| `DB_PASSWORD` | si | Secreto de PostgreSQL. |
| `DB_SSL` | no | `false` para red privada Coolify sin SSL; `true` si el recurso exige SSL. |
| `DB_SSL_REJECT_UNAUTHORIZED` | no | Mantener `true`; usar `false` solo si el servidor SSL usa un certificado no verificable. |
| `STORAGE_PROVIDER` | no | `local` (predeterminado) o `cloudinary`. |
| `UPLOADS_DIR` | no | Debe permanecer `/app/uploads` en Docker. |
| `CLOUDINARY_CLOUD_NAME` | condicional | Solo con Cloudinary. |
| `CLOUDINARY_API_KEY` | condicional | Solo con Cloudinary. |
| `CLOUDINARY_API_SECRET` | condicional | Solo con Cloudinary. |

Genere el JWT sin imprimirlo en logs:

```bash
openssl rand -base64 48
```

## Construccion y ejecucion local

Copie `.env.coolify.example` como `.env` en la raiz y reemplace todos los valores vacios. Ese archivo esta ignorado por Git.

```bash
docker compose config
docker compose build backend
docker compose build frontend
docker compose up -d
docker compose ps
curl --fail http://localhost:4000/health
curl --fail http://localhost:3000/
```

El Compose usa `expose`, no `ports`, por seguridad. Para una prueba exclusivamente local, cree un archivo `docker-compose.override.yml` no versionado con puertos loopback:

```yaml
services:
  frontend:
    ports: ["127.0.0.1:3000:3000"]
  backend:
    ports: ["127.0.0.1:4000:4000"]
```

No use credenciales de produccion para pruebas locales.

## Configuracion en Coolify

1. Cree un proyecto y un entorno de produccion.
2. Cree un recurso PostgreSQL con la misma version mayor que la base local. Mantenga desactivada la exposicion publica y espere a que este saludable.
3. Cree una aplicacion **Docker Compose from Git**, seleccione este repositorio y `docker-compose.yml`.
4. Cargue las variables listadas arriba. Marque contraseñas, JWT y claves Cloudinary como secretos. `NEXT_PUBLIC_API_URL` debe estar disponible durante el build.
5. En Domains agregue:
   - `https://www.example.com:3000` al servicio `frontend`.
   - `https://api.example.com:4000` al servicio `backend`.
6. Active redireccion HTTP a HTTPS. Configure DNS `A/AAAA` hacia el VPS antes de solicitar certificados.
7. Compruebe que el volumen `uploads-data` aparezca en Persistent Storage. Los volumenes declarados en Compose son gestionados desde el archivo.
8. Despliegue primero con la base vacia solo para validar el arranque; `/health` permanecera en `503` hasta que la conexion y el esquema sean validos.

Coolify documenta que los dominios de Compose se asignan por servicio y puerto interno, que sus health checks proceden del Compose y que los volumenes declarados ahi son persistentes. Consulte:

- https://coolify.io/docs/applications/builds/docker-compose
- https://coolify.io/docs/core/networking/domains
- https://coolify.io/docs/databases/postgresql

## Pruebas realizadas durante esta preparacion

- `docker compose config --quiet`: correcto con variables de validacion.
- `node --check` sobre servidor, DB, autenticacion, usuarios, uploads y almacenamiento: correcto.
- Frontend desde directorio temporal limpio: `npm ci` y `npm run build` correctos con Next 15.5.28; genero 16 rutas y la salida standalone. Permanece una advertencia no bloqueante por `<img>` en el preview local de `FileUpload.tsx`.
- Backend desde directorio temporal limpio: `npm ci --omit=dev` y carga de Express/pg/Multer correctos.
- Backend real: `/`, `/api`, CORS permitido, rechazo CORS `403`, y cierre del proceso probados.
- PostgreSQL local: `/health` respondio `200` y ejecuto `SELECT 1`; no se modificaron datos.
- `npm audit --omit=dev`: cero vulnerabilidades conocidas en frontend y backend al momento de la prueba. El frontend usa overrides parcheados compatibles con Next 15 para evitar un salto no solicitado a Next 16.
- Imagenes Docker: se intentaron ambos `docker build`, pero no pudieron comenzar porque Docker Desktop estaba instalado sin el daemon Linux iniciado. Deben ejecutarse los dos comandos de la seccion local cuando el daemon este activo.

Las pruebas de restauracion del dump, persistencia tras un redeploy real, DNS, HTTPS y rutas contra los dominios finales quedan pendientes hasta disponer del entorno Coolify.

## Migracion segura de PostgreSQL

No ejecute los scripts SQL del repositorio sobre una base con datos como sustituto del respaldo. El dump conserva tablas, datos, secuencias, indices, funciones y triggers.

### 1. Comprobar versiones y capacidad

En el equipo local:

```bash
psql --version
pg_dump --version
psql -h localhost -U USUARIO -d BASE -Atc "SHOW server_version;"
psql -h localhost -U USUARIO -d BASE -Atc "SELECT pg_size_pretty(pg_database_size(current_database()));"
psql -h localhost -U USUARIO -d BASE -c "SELECT extname, extversion FROM pg_extension ORDER BY 1;"
```

El destino debe usar la misma version mayor o una posterior compatible. Instale en el destino todas las extensiones no estandar antes de restaurar. La auditoria de los scripts no encontro `CREATE EXTENSION`, pero el servidor real es la fuente de verdad.

### 2. Detener escrituras y exportar

Ponga el sitio en mantenimiento o detenga temporalmente el backend. Cree un archivo custom sin propietarios ni ACL:

```bash
pg_dump -h localhost -p 5432 -U USUARIO -d BASE \
  --format=custom --no-owner --no-acl --verbose \
  --file=coalicion_YYYYMMDD_HHMM.dump
pg_restore --list coalicion_YYYYMMDD_HHMM.dump > coalicion_YYYYMMDD_HHMM.list.txt
sha256sum coalicion_YYYYMMDD_HHMM.dump > coalicion_YYYYMMDD_HHMM.dump.sha256
```

En PowerShell, el hash equivalente es:

```powershell
Get-FileHash .\coalicion_YYYYMMDD_HHMM.dump -Algorithm SHA256
```

### 3. Restaurar sin exponer PostgreSQL

Metodo recomendado: abra el recurso PostgreSQL en Coolify, use **Import Backup**, cargue el `.dump`, deje desactivado conservar owners/privilegios y revise el comando generado antes de confirmar. La importacion puede reemplazar objetos; mantenga el backend detenido y haga antes un backup del destino.

Alternativa por una sesion segura dentro de la red privada:

```bash
pg_restore --host HOST_PRIVADO --port 5432 --username USUARIO_DESTINO \
  --dbname BASE_DESTINO --no-owner --no-acl --exit-on-error \
  coalicion_YYYYMMDD_HHMM.dump
```

No añada `--clean` salvo que haya confirmado que la base destino es descartable y tenga un respaldo verificado.

### 4. Verificar antes de abrir trafico

```bash
psql -h HOST_PRIVADO -U USUARIO_DESTINO -d BASE_DESTINO -c "SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname='public';"
psql -h HOST_PRIVADO -U USUARIO_DESTINO -d BASE_DESTINO -c "SELECT sequence_schema, sequence_name FROM information_schema.sequences ORDER BY 1,2;"
```

Compare conteos de las tablas principales entre origen y destino y pruebe login, listados y lecturas de publicaciones. Arranque el backend y exija respuesta `200` en `/health` antes de abrir el frontend.

## Migracion y respaldo de uploads

No borre `backend/uploads` despues del despliegue. Primero cree y verifique un archivo:

```bash
tar -C backend -czf coalicion-uploads-YYYYMMDD.tar.gz uploads
tar -tzf coalicion-uploads-YYYYMMDD.tar.gz > uploads-manifest.txt
sha256sum coalicion-uploads-YYYYMMDD.tar.gz
```

Transfiera el archivo al VPS por `scp`/SFTP. Con el backend detenido, copie el contenido dentro del volumen montado en `/app/uploads`; desde el host puede usarse el contenedor actual:

```bash
docker cp coalicion-uploads-YYYYMMDD.tar.gz CONTENEDOR_BACKEND:/tmp/uploads.tar.gz
docker exec --user root CONTENEDOR_BACKEND sh -c 'tar -xzf /tmp/uploads.tar.gz -C /app && chown -R node:node /app/uploads'
```

Luego arranque el backend, compruebe varias URLs `/uploads/...` y compare el numero de archivos/tamaño. El `docker exec` como root solo se usa para esta migracion controlada; el proceso normal sigue como usuario `node`. Mantenga una copia externa del tar: los backups de la instancia Coolify no incluyen volumenes de aplicaciones.

## Validacion posterior al despliegue

```bash
curl --fail https://api.example.com/health
curl --fail https://api.example.com/api
curl --fail https://www.example.com/
curl -I https://api.example.com/uploads/RUTA_DE_ARCHIVO_EXISTENTE
```

Ademas:

1. Pruebe login y una ruta protegida con un usuario no administrativo y uno administrativo.
2. Confirme que un origen ajeno recibe rechazo CORS.
3. Suba un archivo de prueba permitido, redepliegue el backend y confirme que continua disponible.
4. Revise Deployment Logs y Runtime Logs; no deben aparecer passwords, tokens ni URLs completas con credenciales.
5. Vigile RAM, CPU y disco durante varios dias antes de fijar limites. En un VPS de 4 GB evite builds simultaneos; despliegue backend y frontend secuencialmente si observa presion de memoria.

## Backups

- PostgreSQL: programe backups diarios en la pestaña Backups, con retencion local y una copia externa S3 compatible si dispone de ella. Ejecute **Back up now** y restaure periodicamente en una base desechable; un job exitoso no demuestra por si solo que la restauracion funciona.
- Uploads: respalde el volumen de `/app/uploads` diariamente con una herramienta del VPS o hacia almacenamiento externo. El dump PostgreSQL no incluye estos archivos.
- Coolify: respalde tambien la instancia y guarde su `APP_KEY` fuera del VPS; ese backup tampoco incluye bases y volumenes de las aplicaciones.

Documentacion oficial: https://coolify.io/docs/databases/backups y https://coolify.io/docs/databases/restore

## Actualizacion y rollback

Para actualizar, haga backup de DB/uploads, publique un commit probado y despliegue esa revision desde Coolify. Revise primero backend/health y despues frontend.

Para revertir una aplicacion defectuosa, use el historial de deployments de Coolify o vuelva a desplegar el commit anterior. No elimine el recurso PostgreSQL ni el volumen `uploads-data`. Si la version defectuosa cambio el esquema, revierta codigo primero y restaure una copia de la base solo cuando el cambio sea incompatible y despues de preservar el estado actual. Un rollback de imagen no revierte datos.

## Diagnostico rapido

- Frontend llama a `localhost`: falta `NEXT_PUBLIC_API_URL` durante el build; corrija y reconstruya, no basta reiniciar.
- Backend no inicia: verifique `JWT_SECRET` y las cinco variables `DB_*`.
- `/health` devuelve `503`: pruebe DNS/puerto privado, credenciales, nombre de base y `DB_SSL` desde la red del servicio.
- Error CORS: el origen debe coincidir exactamente, incluyendo `https` y subdominio; separe multiples valores con comas.
- Upload desaparece tras redeploy: confirme el mount `uploads-data:/app/uploads` y que la aplicacion escribe en `/app/uploads`.
- Imagen remota no carga: verifique que la URL almacenada apunte al dominio publico del backend y que el archivo exista en el volumen.
- Build del frontend falla en `next/font`: el builder necesita salida HTTPS a Google Fonts; reintente con conectividad o migre esas fuentes a archivos locales antes de operar en una red aislada.
