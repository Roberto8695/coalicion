const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function fixTriggerFunction() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Conectando a la base de datos de producción...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'fix_trigger_production.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Ejecutando script de corrección...');
    
    // Ejecutar el script
    const result = await client.query(sql);
    
    console.log('✅ Script ejecutado exitosamente');
    console.log('📋 Resultados:', result.rows);
    
    // Verificar que la función existe
    const checkFunction = await client.query(`
      SELECT routine_name, routine_definition 
      FROM information_schema.routines 
      WHERE routine_name = 'update_updated_at_column'
    `);
    
    if (checkFunction.rows.length > 0) {
      console.log('✅ Función update_updated_at_column() verificada');
    } else {
      console.log('❌ Error: Función no encontrada después de la ejecución');
    }
    
    // Verificar triggers en publicaciones_coalicion
    const checkTriggers = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers 
      WHERE event_object_table = 'publicaciones_coalicion'
    `);
    
    console.log('📋 Triggers en publicaciones_coalicion:');
    checkTriggers.rows.forEach(trigger => {
      console.log(`  - ${trigger.trigger_name}: ${trigger.event_manipulation}`);
    });
    
  } catch (error) {
    console.error('❌ Error al ejecutar el script:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  fixTriggerFunction()
    .then(() => {
      console.log('🎉 Corrección completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error durante la corrección:', error);
      process.exit(1);
    });
}

module.exports = { fixTriggerFunction };