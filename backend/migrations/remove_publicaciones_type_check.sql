-- Permite que publicaciones use los tipos activos de tipos_publicacion.
-- La validacion dinamica se realiza en PublicacionesController.

ALTER TABLE publicaciones
    DROP CONSTRAINT IF EXISTS publicaciones_type_check;
