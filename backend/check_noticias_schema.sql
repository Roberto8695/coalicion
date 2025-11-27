-- Verificar la estructura de la tabla noticias
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'noticias' 
ORDER BY ordinal_position;

-- Verificar si la tabla existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'noticias';

-- Ver algunos datos de ejemplo si existen
SELECT * FROM noticias LIMIT 3;