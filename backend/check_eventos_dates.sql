-- Query para verificar los datos de eventos existentes
SELECT 
    id,
    title,
    date,
    time,
    type,
    status,
    location,
    created_at
FROM eventos 
ORDER BY id;

-- Query para ver tipos de datos y valores nulos
SELECT 
    COUNT(*) as total_eventos,
    COUNT(date) as eventos_con_fecha,
    COUNT(*) - COUNT(date) as eventos_sin_fecha
FROM eventos;

-- Mostrar eventos específicos con problemas de fecha
SELECT 
    id,
    title,
    date,
    CASE 
        WHEN date IS NULL THEN 'NULL'
        WHEN date = '' THEN 'EMPTY'
        ELSE 'HAS_VALUE'
    END as date_status
FROM eventos;