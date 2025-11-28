# Migración de Verificadores a PostgreSQL

Esta guía te ayuda a migrar los datos de verificadores a tu base de datos PostgreSQL.

## Opciones de Migración

### Opción 1: Script Automático (Recomendado)

Ejecuta el script de migración que maneja todo automáticamente:

```bash
cd backend
node migrate_verificadores.js
```

Este script:
- ✅ Crea la tabla `verificadores` con todos los campos necesarios
- ✅ Crea índices para optimizar consultas
- ✅ Crea triggers para actualizar `updatedAt` automáticamente
- ✅ Inserta todos los 6 verificadores predefinidos
- ✅ Te pregunta antes de sobrescribir datos existentes
- ✅ Muestra un resumen de la operación

### Opción 2: Scripts SQL Manuales

Si prefieres ejecutar los scripts manualmente:

#### 1. Crear la tabla
```bash
psql -h hostname -d database_name -U username -f migrations/create_verificadores_table.sql
```

#### 2. Insertar datos
```bash
psql -h hostname -d database_name -U username -f migrations/seed_verificadores_postgres.sql
```

### Opción 3: Desde tu cliente PostgreSQL favorito

Copia y ejecuta el contenido de estos archivos en tu cliente:
1. `migrations/create_verificadores_table.sql`
2. `migrations/seed_verificadores_postgres.sql`

## Estructura de la Tabla

```sql
CREATE TABLE verificadores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type verificador_type NOT NULL, -- ENUM: 'website', 'bot', 'api', 'tool'
    url VARCHAR(500) NOT NULL,
    logo VARCHAR(500),
    features JSONB DEFAULT '[]'::jsonb,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Verificadores que se Migrarán

1. **Chequea Bolivia** (website) - https://chequeabolivia.bo/
2. **CheckiBot** (bot) - https://chekibot.chequeabolivia.bo/
3. **Chequea Tu Voto** (website) - https://chequeatuvoto.chequeabolivia.bo/
4. **Bolivia Verifica** (website) - https://boliviaverifica.bo/
5. **Olivia Verifica** (bot) - WhatsApp bot
6. **Órgano Electoral Plurinacional** (website) - https://www.oep.org.bo/

## Verificar la Migración

Después de ejecutar la migración, verifica que todo funcionó:

```sql
-- Contar verificadores
SELECT COUNT(*) FROM verificadores;

-- Ver todos los verificadores
SELECT id, name, type, "isActive" FROM verificadores ORDER BY id;

-- Ver características de un verificador
SELECT name, features FROM verificadores WHERE name = 'Chequea Bolivia';
```

## Configuración del Backend

Asegúrate de que tu archivo `config/db.js` esté configurado para PostgreSQL:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'tu_usuario',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'coalicion',
  password: process.env.DB_PASSWORD || 'tu_password',
  port: process.env.DB_PORT || 5432,
});

module.exports = { pool };
```

## Variables de Entorno

Configura estas variables en tu archivo `.env`:

```env
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
DB_NAME=coalicion
DB_HOST=localhost
DB_PORT=5432
```

## Solución de Problemas

### Error: "relation verificadores does not exist"
- La tabla no se creó correctamente
- Ejecuta primero `create_verificadores_table.sql`

### Error: "type verificador_type does not exist"
- El tipo ENUM no se creó
- Ejecuta el script completo de creación de tabla

### Error: "duplicate key value violates unique constraint"
- Ya existen verificadores con esos IDs
- Usa `TRUNCATE verificadores RESTART IDENTITY;` para limpiar la tabla

### Error de conexión a PostgreSQL
- Verifica las credenciales en `.env`
- Asegúrate de que PostgreSQL esté corriendo
- Verifica permisos de usuario

## Después de la Migración

1. **Reinicia el backend** para que use la nueva estructura
2. **Ve al dashboard** → Verificadores para ver el CMS
3. **Visita `/recursos`** para ver los verificadores en el frontend
4. **Prueba el CMS** agregando/editando verificadores

¡Tu sistema de verificadores ya está listo para usar! 🎉