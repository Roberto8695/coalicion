-- Actualizar eventos sin fecha para que tengan una fecha por defecto
UPDATE eventos 
SET date = '2025-12-01 10:00:00-04:00'
WHERE date IS NULL OR date = '';

-- Verificar la actualización
SELECT 
    id,
    title,
    date,
    time
FROM eventos 
ORDER BY id;