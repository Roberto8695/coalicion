const { pool } = require('./config/db');

async function checkSchema() {
  try {
    console.log('=== VERIFICANDO TABLA NOTICIAS ===\n');
    
    // Verificar si la tabla existe
    const tableExists = await pool.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_name = 'noticias'
    `);
    
    if (tableExists.rows.length === 0) {
      console.log('❌ La tabla noticias NO EXISTE');
      return;
    }
    
    console.log('✅ La tabla noticias existe');
    console.log('Tipo:', tableExists.rows[0].table_type);
    console.log();
    
    // Verificar estructura
    const structure = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'noticias' 
      ORDER BY ordinal_position
    `);
    
    console.log('=== ESTRUCTURA DE LA TABLA ===');
    structure.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type}${col.character_maximum_length ? '(' + col.character_maximum_length + ')' : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? 'DEFAULT ' + col.column_default : ''}`);
    });
    
    console.log('\n=== DATOS DE EJEMPLO ===');
    const data = await pool.query('SELECT * FROM noticias LIMIT 3');
    if (data.rows.length > 0) {
      console.log('Registros encontrados:', data.rows.length);
      console.log('Primer registro:', JSON.stringify(data.rows[0], null, 2));
    } else {
      console.log('No hay datos en la tabla');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkSchema();