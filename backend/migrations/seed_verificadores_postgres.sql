-- Insertar datos de verificadores en PostgreSQL
-- Ejecutar después de crear la tabla verificadores

INSERT INTO verificadores (name, description, type, url, logo, features, "isActive") VALUES 
(
  'Chequea Bolivia',
  'Plataforma especializada en verificación de hechos y noticias en Bolivia.',
  'website',
  'https://chequeabolivia.bo/',
  '/logos/logo-chequea.webp',
  '["Verificación en tiempo real", "Base de datos de noticias falsas", "Reportes semanales"]'::jsonb,
  true
),
(
  'CheckiBot',
  'Bot de verificación automática para WhatsApp y Telegram.',
  'bot',
  'https://chekibot.chequeabolivia.bo/',
  '/logos/cheki.jpg',
  '["Verificación por WhatsApp", "Respuestas automáticas", "Enlaces a fuentes oficiales"]'::jsonb,
  true
),
(
  'Chequea Tu Voto',
  'Información oficial del Órgano Electoral Plurinacional de Bolivia.',
  'website',
  'https://chequeatuvoto.chequeabolivia.bo/',
  '/logos/chequeatuvoto.webp',
  '["Datos oficiales", "Resultados electorales", "Normativa actualizada"]'::jsonb,
  true
),
(
  'Bolivia Verifica',
  'Herramienta de monitoreo y análisis de procesos electorales.',
  'website',
  'https://boliviaverifica.bo/',
  '/logos/LOGO-bolivia.png',
  '["Monitoreo en vivo", "Análisis estadístico", "Alertas tempranas"]'::jsonb,
  true
),
(
  'Olivia Verifica',
  'Bot especializado en detección automática de contenido falso.',
  'bot',
  'https://api.whatsapp.com/send?phone=59162352290&text=%C2%A1Hola%20Olivia!%20Necesito%20tu%20ayuda',
  '/logos/olivia.webp',
  '["Análisis de imágenes", "Verificación de videos", "Reportes instantáneos"]'::jsonb,
  true
),
(
  'Órgano Electoral Plurinacional',
  'Interfaz de programación para desarrolladores y medios de comunicación.',
  'website',
  'https://www.oep.org.bo/',
  '/logos/OEPg.png',
  '["Integración fácil", "Documentación completa", "Acceso gratuito"]'::jsonb,
  true
);

-- Verificar que los datos se insertaron correctamente
SELECT 
    id,
    name,
    type,
    "isActive",
    jsonb_array_length(features) as feature_count,
    "createdAt"
FROM verificadores 
ORDER BY id;