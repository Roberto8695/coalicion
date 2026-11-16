CREATE TABLE IF NOT EXISTS categorias_documentos_electorales (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categorias_documentos_electorales (name, slug, color)
VALUES
    ('Manual', 'manual', '#2563EB'),
    ('Procedimiento', 'procedimiento', '#16A34A'),
    ('Normativa', 'normativa', '#9333EA'),
    ('Capacitación', 'capacitacion', '#EA580C'),
    ('Informe', 'informe', '#4F46E5')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE repositorio_documentos
    ADD COLUMN IF NOT EXISTS categoria_id INTEGER;

UPDATE repositorio_documentos d
SET categoria_id = c.id
FROM categorias_documentos_electorales c
WHERE d.categoria_id IS NULL
  AND (LOWER(d.categoria) = LOWER(c.name) OR LOWER(d.categoria) = c.slug);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_repositorio_documentos_categoria'
    ) THEN
        ALTER TABLE repositorio_documentos
            ADD CONSTRAINT fk_repositorio_documentos_categoria
            FOREIGN KEY (categoria_id)
            REFERENCES categorias_documentos_electorales(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_categoria_id
    ON repositorio_documentos(categoria_id);
