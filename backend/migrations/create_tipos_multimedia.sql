CREATE TABLE IF NOT EXISTS tipos_multimedia (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tipos_multimedia (name, slug, color)
VALUES
    ('Infografía', 'infografia', '#2563EB'),
    ('Video', 'video', '#DC2626'),
    ('Arte', 'arte', '#9333EA'),
    ('Presentación', 'presentacion', '#16A34A')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE multimedia
    DROP CONSTRAINT IF EXISTS multimedia_type_check;
