-- Crear la tabla para almacenar los documentos descargables
CREATE TABLE IF NOT EXISTS repositorio_documentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL,       -- Ej: 'Manual', 'Normativa', 'Capacitación'
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_publicacion DATE NOT NULL,
    formato_archivo VARCHAR(20) DEFAULT 'PDF',  -- Ej: 'PDF', 'DOCX'
    tamano_texto VARCHAR(20),             -- Ej: '2.3 MB'. Se guarda como texto para mostrarlo directo.
    ruta_archivo TEXT NOT NULL,           -- URL o ruta interna para el botón 'Descargar'
    ruta_vista_previa TEXT,               -- URL para el botón 'Vista Previa' (puede ser NULL si no tiene)
    estado VARCHAR(20) DEFAULT 'publicado', -- Estado del documento (borrador, revision, publicado, archivado)
    autor VARCHAR(100),                   -- Nombre del autor del documento
    version VARCHAR(10) DEFAULT '1.0',   -- Versión del documento
    tags TEXT,                            -- Etiquetas separadas por comas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (Opcional) Añadir comentarios para documentar
COMMENT ON TABLE repositorio_documentos IS 'Tabla que almacena PDFs y recursos descargables del centro de recursos';
COMMENT ON COLUMN repositorio_documentos.tamano_texto IS 'Tamaño del archivo formateado para mostrar (ej. 2.3 MB)';
COMMENT ON COLUMN repositorio_documentos.categoria IS 'Categoría del documento: Manual, Normativa, Capacitación, Procedimiento, Informe';
COMMENT ON COLUMN repositorio_documentos.estado IS 'Estado del documento: borrador, revision, publicado, archivado';

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_categoria ON repositorio_documentos(categoria);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_estado ON repositorio_documentos(estado);
CREATE INDEX IF NOT EXISTS idx_repositorio_documentos_fecha ON repositorio_documentos(fecha_publicacion);

-- Insertar algunos datos de ejemplo
INSERT INTO repositorio_documentos (categoria, titulo, descripcion, fecha_publicacion, formato_archivo, tamano_texto, ruta_archivo, ruta_vista_previa, autor, version, tags) VALUES
('Manual', 'Manual de Verificación de Hechos Electorales', 'Guía completa para la verificación de información electoral y detección de desinformación.', '2024-03-15', 'PDF', '2.3 MB', '/docs/manual-verificacion.pdf', '/docs/preview/manual-verificacion.pdf', 'OEP - Tribunal Supremo Electoral', '1.0', 'verificación, electoral, manual, desinformación'),
('Procedimiento', 'Procedimientos de Monitoreo Electoral', 'Protocolos y metodologías para el monitoreo efectivo de procesos electorales.', '2024-02-28', 'PDF', '1.8 MB', '/docs/procedimientos-monitoreo.pdf', '/docs/preview/procedimientos-monitoreo.pdf', 'Dirección de Fiscalización Electoral', '2.1', 'monitoreo, procedimiento, electoral'),
('Normativa', 'Marco Normativo Electoral Boliviano', 'Compendio de leyes y reglamentos que rigen los procesos electorales en Bolivia.', '2024-01-20', 'PDF', '4.1 MB', '/docs/marco-normativo.pdf', NULL, 'Dirección Jurídica - OEP', '3.0', 'normativa, leyes, reglamentos, bolivia'),
('Capacitación', 'Guía de Capacitación para Observadores', 'Material de formación para observadores electorales y verificadores de información.', '2024-03-01', 'PDF', '3.2 MB', '/docs/capacitacion-observadores.pdf', '/docs/preview/capacitacion-observadores.pdf', 'Escuela de Formación Electoral', '1.5', 'capacitación, observadores, formación'),
('Informe', 'Informe de Monitoreo Electoral 2024', 'Análisis detallado del proceso electoral y recomendaciones para futuras elecciones.', '2024-04-10', 'PDF', '5.7 MB', '/docs/informe-monitoreo-2024.pdf', '/docs/preview/informe-monitoreo-2024.pdf', 'Coordinación de Monitoreo', '1.0', 'informe, monitoreo, análisis, 2024');