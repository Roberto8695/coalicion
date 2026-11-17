CREATE TABLE IF NOT EXISTS tipos_evento (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estados_evento (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tipos_evento (name, slug, color) VALUES
    ('Taller', 'taller', '#2563EB'),
    ('Capacitación', 'capacitacion', '#16A34A'),
    ('Foro', 'foro', '#9333EA'),
    ('Debate', 'debate', '#DC2626')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO estados_evento (name, slug, color) VALUES
    ('Próximo', 'upcoming', '#EAB308'),
    ('En curso', 'ongoing', '#16A34A'),
    ('Completado', 'completed', '#6B7280'),
    ('Cancelado', 'cancelled', '#DC2626')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_type_check;
ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_status_check;
