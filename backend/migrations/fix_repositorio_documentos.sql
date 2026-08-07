-- Script para corregir repositorio_documentos
-- Renombrar columnas y agregar trigger automático

-- 1. Renombrar columnas
ALTER TABLE repositorio_documentos 
    RENAME COLUMN created_at TO createdat;

ALTER TABLE repositorio_documentos 
    RENAME COLUMN updated_at TO updatedat;

-- 2. Modificar los valores por defecto
ALTER TABLE repositorio_documentos 
    ALTER COLUMN createdat SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE repositorio_documentos 
    ALTER COLUMN updatedat SET DEFAULT CURRENT_TIMESTAMP;

-- 3. Crear el trigger para actualizar updatedat automáticamente
CREATE TRIGGER update_repositorio_documentos_updatedat 
    BEFORE UPDATE ON repositorio_documentos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar la estructura
\d repositorio_documentos
