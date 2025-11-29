const { pool } = require('./config/db');

async function fixFunction() {
    try {
        console.log('=== CORRIGIENDO FUNCIÓN update_updated_at_column ===');
        
        // Crear o reemplazar la función corregida
        const fixQuery = `
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `;
        
        await pool.query(fixQuery);
        console.log('✅ Función corregida exitosamente.');
        
        // Verificar que el trigger siga activo
        const checkTriggerQuery = `
            SELECT trigger_name 
            FROM information_schema.triggers 
            WHERE event_object_table = 'publicaciones_coalicion' 
            AND trigger_name = 'update_publicaciones_coalicion_updated_at';
        `;
        
        const triggerResult = await pool.query(checkTriggerQuery);
        if (triggerResult.rows.length > 0) {
            console.log('✅ Trigger sigue activo.');
        } else {
            console.log('⚠️  Trigger no encontrado. Creándolo...');
            
            const createTriggerQuery = `
                CREATE TRIGGER update_publicaciones_coalicion_updated_at
                BEFORE UPDATE ON publicaciones_coalicion
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `;
            
            await pool.query(createTriggerQuery);
            console.log('✅ Trigger creado.');
        }
        
        console.log('\n=== PRUEBA DE LA CORRECCIÓN ===');
        console.log('Ahora puedes probar actualizar una publicación de coalición.');
        
    } catch (error) {
        console.error('Error corrigiendo función:', error.message);
    } finally {
        await pool.end();
    }
}

fixFunction();