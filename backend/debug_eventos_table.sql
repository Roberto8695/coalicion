-- Script para verificar y limpiar la tabla eventos

-- 1. Verificar la estructura actual de la tabla
\d eventos;

-- 2. Mostrar datos existentes (para verificar qué campos tienen)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'eventos';

-- 3. Ver si hay registros con campos problemáticos
SELECT * FROM eventos LIMIT 5;

-- 4. Limpiar datos existentes (CUIDADO: esto eliminará todos los eventos)
-- Descomenta la siguiente línea solo si quieres empezar limpio
-- DELETE FROM eventos;

-- 5. Verificar que la tabla tiene la estructura correcta
-- Si la tabla no tiene la estructura correcta, ejecutar:

-- DROP TABLE IF EXISTS eventos;

-- CREATE TABLE eventos (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     type VARCHAR(50) NOT NULL CHECK (type IN ('taller', 'capacitacion', 'foro', 'debate')),
--     date TIMESTAMP WITH TIME ZONE,
--     time VARCHAR(50),
--     location VARCHAR(255),
--     description TEXT,
--     duration VARCHAR(50),
--     capacity INTEGER,
--     registrationUrl VARCHAR(255),
--     slug VARCHAR(255) UNIQUE,
--     organizer VARCHAR(255),
--     status VARCHAR(50) CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
--     image VARCHAR(255),
--     requirements TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- 6. Insertar datos de prueba limpios
INSERT INTO eventos (title, type, date, time, location, description, duration, capacity, organizer, status, slug) VALUES
('Taller de Verificación de Hechos', 'taller', '2025-11-15 10:00:00+00', '10:00 AM', 'Centro de Capacitación La Paz', 'Aprende técnicas básicas para verificar información y detectar noticias falsas.', '3 horas', 30, 'Coalición por la Transparencia', 'upcoming', 'taller-verificacion-hechos-2025'),
('Capacitación en Fact-Checking Electoral', 'capacitacion', '2025-11-18 14:30:00+00', '2:30 PM', 'Universidad Mayor de San Andrés', 'Formación especializada en verificación de contenido electoral y político.', '4 horas', 50, 'Coalición por la Transparencia', 'upcoming', 'capacitacion-fact-checking-electoral-2025'),
('Foro: Desinformación y Democracia', 'foro', '2025-11-22 19:00:00+00', '7:00 PM', 'Auditorio CERES', 'Discusión abierta sobre el impacto de la desinformación en los procesos democráticos.', '2 horas', 100, 'Coalición por la Transparencia', 'upcoming', 'foro-desinformacion-democracia-2025'),
('Debate: Medios y Transparencia Electoral', 'debate', '2025-11-25 16:00:00+00', '4:00 PM', 'Canal Universitario', 'Debate entre expertos sobre el rol de los medios en la transparencia electoral.', '90 minutos', NULL, 'Coalición por la Transparencia', 'upcoming', 'debate-medios-transparencia-2025');