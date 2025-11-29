const { pool } = require('./config/db');

async function checkFunction() {
    try {
        console.log('=== VERIFICANDO FUNCIÓN update_updated_at_column ===');
        
        const functionQuery = `
            SELECT routine_definition 
            FROM information_schema.routines 
            WHERE routine_name = 'update_updated_at_column';
        `;
        
        const functionResult = await pool.query(functionQuery);
        if (functionResult.rows.length > 0) {
            console.log('Definición de la función:');
            console.log(functionResult.rows[0].routine_definition);
        } else {
            console.log('Función no encontrada en information_schema.');
            
            // Intentar buscar en pg_proc directamente
            const procQuery = `
                SELECT prosrc 
                FROM pg_proc 
                WHERE proname = 'update_updated_at_column';
            `;
            
            const procResult = await pool.query(procQuery);
            if (procResult.rows.length > 0) {
                console.log('Función encontrada en pg_proc:');
                console.log(procResult.rows[0].prosrc);
            }
        }
        
    } catch (error) {
        console.error('Error verificando función:', error.message);
    } finally {
        await pool.end();
    }
}

checkFunction();