-- Migración para crear la tabla verificadores en PostgreSQL
-- Ejecutar este script en tu base de datos PostgreSQL

-- Crear tipo enum para los tipos de verificador
CREATE TYPE verificador_type AS ENUM ('website', 'bot', 'api', 'tool');

-- Crear tabla verificadores
CREATE TABLE IF NOT EXISTS verificadores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type verificador_type NOT NULL,
    url VARCHAR(500) NOT NULL,
    logo VARCHAR(500),
    features JSONB DEFAULT '[]'::jsonb,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_verificadores_type ON verificadores(type);
CREATE INDEX IF NOT EXISTS idx_verificadores_isActive ON verificadores("isActive");
CREATE INDEX IF NOT EXISTS idx_verificadores_name ON verificadores(name);

-- Crear función para actualizar updatedAt automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updatedAt
CREATE TRIGGER update_verificadores_updated_at 
    BEFORE UPDATE ON verificadores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE verificadores IS 'Tabla para almacenar herramientas de verificación de hechos';
COMMENT ON COLUMN verificadores.type IS 'Tipo de verificador: website, bot, api, tool';
COMMENT ON COLUMN verificadores.features IS 'Array JSON de características del verificador';
COMMENT ON COLUMN verificadores."isActive" IS 'Indica si el verificador está activo y visible';