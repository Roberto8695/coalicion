-- Script para corregir los nombres de columnas en publicaciones_coalicion y usuarios
-- De snake_case con guion bajo a snake_case sin guion bajo para consistencia

-- ============================================
-- TABLA: publicaciones_coalicion
-- ============================================

-- 1. Eliminar el trigger existente
DROP TRIGGER IF EXISTS update_publicaciones_coalicion_updated_at ON publicaciones_coalicion;

-- 2. Renombrar columnas
ALTER TABLE publicaciones_coalicion 
    RENAME COLUMN created_at TO createdat;

ALTER TABLE publicaciones_coalicion 
    RENAME COLUMN updated_at TO updatedat;

-- 3. Recrear índices
DROP INDEX IF EXISTS idx_publicaciones_coalicion_created_at;
CREATE INDEX IF NOT EXISTS idx_publicaciones_coalicion_createdat ON publicaciones_coalicion(createdat);

-- 4. Recrear el trigger
CREATE TRIGGER update_publicaciones_coalicion_updatedat 
    BEFORE UPDATE ON publicaciones_coalicion 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: usuarios
-- ============================================

-- 1. Eliminar el trigger existente
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;

-- 2. Renombrar columnas
ALTER TABLE usuarios 
    RENAME COLUMN created_at TO createdat;

ALTER TABLE usuarios 
    RENAME COLUMN updated_at TO updatedat;

-- 3. Recrear el trigger
CREATE TRIGGER update_usuarios_updatedat 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar las estructuras
\echo '\n=== PUBLICACIONES_COALICION ==='
\d publicaciones_coalicion

\echo '\n=== USUARIOS ==='
\d usuarios
