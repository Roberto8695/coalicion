-- Script para corregir los nombres de columnas en verificadores
-- De CamelCase a snake_case para consistencia con el resto de la aplicación

-- 1. Eliminar el trigger existente
DROP TRIGGER IF EXISTS update_verificadores_updated_at ON verificadores;

-- 2. Renombrar columnas de CamelCase a snake_case
ALTER TABLE verificadores 
    RENAME COLUMN "isActive" TO isactive;

ALTER TABLE verificadores 
    RENAME COLUMN "createdAt" TO createdat;

ALTER TABLE verificadores 
    RENAME COLUMN "updatedAt" TO updatedat;

-- 3. Agregar columnas opcionales si no existen
ALTER TABLE verificadores 
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

ALTER TABLE verificadores 
    ADD COLUMN IF NOT EXISTS contact JSONB;

ALTER TABLE verificadores 
    ADD COLUMN IF NOT EXISTS socialmedia JSONB;

-- 4. Crear índice para slug
CREATE INDEX IF NOT EXISTS idx_verificadores_slug ON verificadores(slug);

-- 5. Actualizar la función trigger para usar snake_case
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Recrear el trigger
CREATE TRIGGER update_verificadores_updatedat 
    BEFORE UPDATE ON verificadores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar la estructura
\d verificadores
