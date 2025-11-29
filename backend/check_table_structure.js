const { pool } = require('./config/db');

async function checkTableStructure() {
    try {
        // Verificar estructura de la tabla publicaciones_coalicion
        console.log('=== VERIFICANDO ESTRUCTURA DE publicaciones_coalicion ===');
        
        const columnsQuery = `
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'publicaciones_coalicion'
            ORDER BY ordinal_position;
        `;
        
        const columnsResult = await pool.query(columnsQuery);
        console.log('Columnas encontradas:');
        columnsResult.rows.forEach(col => {
            console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Verificar triggers
        console.log('\n=== VERIFICANDO TRIGGERS ===');
        const triggersQuery = `
            SELECT trigger_name, event_manipulation, action_statement 
            FROM information_schema.triggers 
            WHERE event_object_table = 'publicaciones_coalicion';
        `;
        
        const triggersResult = await pool.query(triggersQuery);
        if (triggersResult.rows.length > 0) {
            console.log('Triggers encontrados:');
            triggersResult.rows.forEach(trigger => {
                console.log(`- ${trigger.trigger_name}: ${trigger.event_manipulation}`);
                console.log(`  Acción: ${trigger.action_statement}`);
            });
        } else {
            console.log('No se encontraron triggers.');
        }
        
    } catch (error) {
        console.error('Error verificando estructura:', error.message);
    } finally {
        await pool.end();
    }
}

checkTableStructure();