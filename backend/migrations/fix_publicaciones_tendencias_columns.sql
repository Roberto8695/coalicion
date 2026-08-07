-- Script para corregir los nombres de columnas en publicaciones_tendencias
-- De snake_case con guion bajo a snake_case sin guion bajo para consistencia

-- 1. Eliminar el trigger existente
DROP TRIGGER IF EXISTS update_publicaciones_tendencias_updated_at ON publicaciones_tendencias;

-- 2. Renombrar columnas de updated_at/created_at a updatedat/createdat
ALTER TABLE publicaciones_tendencias 
    RENAME COLUMN created_at TO createdat;

ALTER TABLE publicaciones_tendencias 
    RENAME COLUMN updated_at TO updatedat;

-- 3. Recrear índices con los nuevos nombres
DROP INDEX IF EXISTS idx_publicaciones_tendencias_created_at;
CREATE INDEX IF NOT EXISTS idx_publicaciones_tendencias_createdat ON publicaciones_tendencias(createdat);

-- 4. Recrear el trigger usando la función existente
CREATE TRIGGER update_publicaciones_tendencias_updatedat 
    BEFORE UPDATE ON publicaciones_tendencias 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar la estructura
\d publicaciones_tendencias
