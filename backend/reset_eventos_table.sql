-- Limpiar y recrear la tabla eventos con la estructura correcta

-- 1. Eliminar tabla existente (CUIDADO: esto elimina todos los datos)
DROP TABLE IF EXISTS eventos CASCADE;

-- 2. Crear tabla con la estructura correcta
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('taller', 'capacitacion', 'foro', 'debate')),
    date TIMESTAMP WITH TIME ZONE,
    time VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    duration VARCHAR(50),
    capacity INTEGER,
    registrationUrl VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    organizer VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
    image VARCHAR(255),
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar algunos eventos de prueba
INSERT INTO eventos (title, type, date, time, location, description, duration, capacity, organizer, status, slug) VALUES
(
    'Taller de Verificación de Hechos', 
    'taller', 
    '2025-11-15 10:00:00-04:00', 
    '10:00 AM', 
    'Centro de Capacitación La Paz', 
    'Aprende técnicas básicas para verificar información y detectar noticias falsas.', 
    '3 horas', 
    30, 
    'Coalición por la Transparencia', 
    'upcoming', 
    'taller-verificacion-hechos-2025'
),
(
    'Capacitación en Fact-Checking Electoral', 
    'capacitacion', 
    '2025-11-18 14:30:00-04:00', 
    '2:30 PM', 
    'Universidad Mayor de San Andrés', 
    'Formación especializada en verificación de contenido electoral y político.', 
    '4 horas', 
    50, 
    'Coalición por la Transparencia', 
    'upcoming', 
    'capacitacion-fact-checking-electoral-2025'
),
(
    'Foro: Desinformación y Democracia', 
    'foro', 
    '2025-11-22 19:00:00-04:00', 
    '7:00 PM', 
    'Auditorio CERES', 
    'Discusión abierta sobre el impacto de la desinformación en los procesos democráticos.', 
    '2 horas', 
    100, 
    'Coalición por la Transparencia', 
    'upcoming', 
    'foro-desinformacion-democracia-2025'
),
(
    'Debate: Medios y Transparencia Electoral', 
    'debate', 
    '2025-11-25 16:00:00-04:00', 
    '4:00 PM', 
    'Canal Universitario', 
    'Debate entre expertos sobre el rol de los medios en la transparencia electoral.', 
    '90 minutos', 
    NULL, 
    'Coalición por la Transparencia', 
    'upcoming', 
    'debate-medios-transparencia-2025'
);

-- 4. Verificar que todo está correcto
SELECT 
    id, 
    title, 
    type, 
    date, 
    time, 
    location, 
    status 
FROM eventos 
ORDER BY date;