-- Verificar si hay columnas del esquema anterior en la tabla eventos
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'eventos' 
ORDER BY ordinal_position;

-- Ver si hay datos existentes
SELECT id, 
       CASE WHEN id IS NOT NULL THEN 'OK' ELSE 'ERROR' END as status,
       title,
       type,
       date,
       time,
       location,
       status as event_status
FROM eventos 
LIMIT 10;

-- Si encuentras columnas como startdate, enddate, maxparticipants, etc.
-- necesitarás ejecutar esta migración:

-- ALTER TABLE eventos DROP COLUMN IF EXISTS startdate;
-- ALTER TABLE eventos DROP COLUMN IF EXISTS enddate;  
-- ALTER TABLE eventos DROP COLUMN IF EXISTS maxparticipants;
-- ALTER TABLE eventos DROP COLUMN IF EXISTS imageurl;

-- IMPORTANTE: Antes de hacer DROP, migra los datos:
-- UPDATE eventos SET 
--   date = startdate,
--   capacity = maxparticipants,
--   image = imageurl
-- WHERE startdate IS NOT NULL OR maxparticipants IS NOT NULL OR imageurl IS NOT NULL;