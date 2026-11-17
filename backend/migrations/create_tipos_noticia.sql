CREATE TABLE IF NOT EXISTS tipos_noticia (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tipos_noticia (name, slug, color)
VALUES
    ('Actividad', 'actividad', '#2563EB'),
    ('Taller', 'taller', '#16A34A'),
    ('Comunicado', 'comunicado', '#9333EA'),
    ('Evento', 'evento', '#EA580C')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE noticias
    DROP CONSTRAINT IF EXISTS noticias_type_check;
