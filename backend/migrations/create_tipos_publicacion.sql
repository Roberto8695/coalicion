CREATE TABLE IF NOT EXISTS tipos_publicacion (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tipos_publicacion (name, slug, color)
VALUES
    ('Informe', 'informe', '#2563EB'),
    ('Estudio', 'estudio', '#16A34A'),
    ('Monitoreo', 'monitoreo', '#9333EA'),
    ('Investigación', 'investigacion', '#EA580C')
ON CONFLICT (slug) DO NOTHING;
