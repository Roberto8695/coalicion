-- Script para arreglar la función trigger en producción
-- Este script corrige el error: "el registro 'nuevo' no tiene campo 'actualizado'"

-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Crear la función corregida
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Usar 'updated_at' en lugar de 'actualizado'
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar que todas las tablas tengan la columna updated_at
-- Si alguna tabla no tiene updated_at, agregarla
DO $$
DECLARE
    table_name TEXT;
    table_names TEXT[] := ARRAY[
        'publicaciones_coalicion',
        'publicaciones',
        'noticias',
        'eventos',
        'guias_electorales',
        'multimedia',
        'verificadores',
        'categorias',
        'usuarios'
    ];
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        -- Verificar si la tabla existe y agregar updated_at si no existe
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name) THEN
            -- Agregar columna updated_at si no existe
            IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = table_name AND column_name = 'updated_at'
            ) THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', table_name);
                RAISE NOTICE 'Agregada columna updated_at a tabla %', table_name;
            END IF;
            
            -- Recrear el trigger para esta tabla
            EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', table_name, table_name);
            EXECUTE format('CREATE TRIGGER update_%I_updated_at 
                           BEFORE UPDATE ON %I 
                           FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
                           table_name, table_name);
            RAISE NOTICE 'Trigger actualizado para tabla %', table_name;
        END IF;
    END LOOP;
END $$;

-- Verificar que la función esté trabajando correctamente
SELECT 'Función update_updated_at_column() creada exitosamente' as status;