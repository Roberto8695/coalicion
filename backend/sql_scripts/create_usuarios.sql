-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'lector' CHECK (rol IN ('administrador', 'editor', 'lector')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto (password: admin123)
-- Nota: En producción, usar un hash seguro de bcrypt
INSERT INTO usuarios (nombre, correo, password, rol) 
VALUES ('Administrador', 'admin@coalicion.bo', '$2b$10$rBkJfKGOpTb5Zt.P8f1x2ucYLM8YbZJPVGKa4Qz5ZBu5BpXU8DzGy', 'administrador')
ON CONFLICT (correo) DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE usuarios IS 'Tabla para gestionar usuarios del sistema';
COMMENT ON COLUMN usuarios.nombre IS 'Nombre completo del usuario';
COMMENT ON COLUMN usuarios.correo IS 'Correo electrónico único del usuario';
COMMENT ON COLUMN usuarios.password IS 'Contraseña hasheada con bcrypt';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: administrador, editor, lector';
COMMENT ON COLUMN usuarios.activo IS 'Estado del usuario (activo/inactivo)';