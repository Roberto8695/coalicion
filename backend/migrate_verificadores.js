/**
 * Script de migración para crear la tabla verificadores e insertar datos iniciales
 * Ejecutar desde la carpeta backend: node migrate_verificadores.js
 */

const fs = require('fs');
const path = require('path');

// Importar la configuración de base de datos
const db = require('./config/db');

const verificadoresData = [
  {
    name: "Chequea Bolivia",
    description: "Plataforma especializada en verificación de hechos y noticias en Bolivia.",
    type: "website",
    url: "https://chequeabolivia.bo/",
    logo: "/logos/logo-chequea.webp",
    features: ["Verificación en tiempo real", "Base de datos de noticias falsas", "Reportes semanales"],
    isActive: true
  },
  {
    name: "CheckiBot",
    description: "Bot de verificación automática para WhatsApp y Telegram.",
    type: "bot",
    url: "https://chekibot.chequeabolivia.bo/",
    logo: "/logos/cheki.jpg",
    features: ["Verificación por WhatsApp", "Respuestas automáticas", "Enlaces a fuentes oficiales"],
    isActive: true
  },
  {
    name: "Chequea Tu Voto",
    description: "Información oficial del Órgano Electoral Plurinacional de Bolivia.",
    type: "website",
    url: "https://chequeatuvoto.chequeabolivia.bo/",
    logo: "/logos/chequeatuvoto.webp",
    features: ["Datos oficiales", "Resultados electorales", "Normativa actualizada"],
    isActive: true
  },
  {
    name: "Bolivia Verifica",
    description: "Herramienta de monitoreo y análisis de procesos electorales.",
    type: "website",
    url: "https://boliviaverifica.bo/",
    logo: "/logos/LOGO-bolivia.png",
    features: ["Monitoreo en vivo", "Análisis estadístico", "Alertas tempranas"],
    isActive: true
  },
  {
    name: "Olivia Verifica",
    description: "Bot especializado en detección automática de contenido falso.",
    type: "bot",
    url: "https://api.whatsapp.com/send?phone=59162352290&text=%C2%A1Hola%20Olivia!%20Necesito%20tu%20ayuda",
    logo: "/logos/olivia.webp",
    features: ["Análisis de imágenes", "Verificación de videos", "Reportes instantáneos"],
    isActive: true
  },
  {
    name: "Órgano Electoral Plurinacional",
    description: "Interfaz de programación para desarrolladores y medios de comunicación.",
    type: "website",
    url: "https://www.oep.org.bo/",
    logo: "/logos/OEPg.png",
    features: ["Integración fácil", "Documentación completa", "Acceso gratuito"],
    isActive: true
  }
];

async function createVerificadoresTable() {
  const client = await db.pool.connect();
  
  try {
    console.log('🔧 Iniciando migración de verificadores...');
    
    // Crear tipo enum
    console.log('📝 Creando tipo enum...');
    await client.query(`
      DO $$ 
      BEGIN 
        CREATE TYPE verificador_type AS ENUM ('website', 'bot', 'api', 'tool');
      EXCEPTION 
        WHEN duplicate_object THEN 
          RAISE NOTICE 'El tipo verificador_type ya existe, continuando...';
      END 
      $$;
    `);

    // Crear tabla
    console.log('📝 Creando tabla verificadores...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS verificadores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type verificador_type NOT NULL,
        url VARCHAR(500) NOT NULL,
        logo VARCHAR(500),
        features JSONB DEFAULT '[]'::jsonb,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear índices
    console.log('📝 Creando índices...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_verificadores_type ON verificadores(type);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_verificadores_isactive ON verificadores(isactive);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_verificadores_name ON verificadores(name);
    `);

    // Crear función y trigger para updatedAt
    console.log('📝 Creando función de actualización...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updatedat = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_verificadores_updated_at ON verificadores;
      CREATE TRIGGER update_verificadores_updated_at 
        BEFORE UPDATE ON verificadores 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Tabla verificadores creada exitosamente');
    return true;

  } catch (error) {
    console.error('❌ Error creando tabla:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertVerificadores() {
  const client = await db.pool.connect();
  
  try {
    console.log('📦 Insertando datos de verificadores...');
    
    // Verificar si ya existen datos
    const existingData = await client.query('SELECT COUNT(*) FROM verificadores');
    const count = parseInt(existingData.rows[0].count);
    
    if (count > 0) {
      console.log(`⚠️  La tabla ya contiene ${count} registros.`);
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('¿Desea eliminar los datos existentes e insertar los nuevos? (y/n): ', resolve);
      });
      rl.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('🔄 Operación cancelada por el usuario');
        return false;
      }
      
      await client.query('TRUNCATE verificadores RESTART IDENTITY');
      console.log('🗑️  Datos existentes eliminados');
    }

    // Insertar nuevos datos
    for (let i = 0; i < verificadoresData.length; i++) {
      const verificador = verificadoresData[i];
      
      await client.query(`
        INSERT INTO verificadores (name, description, type, url, logo, features, isactive)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        verificador.name,
        verificador.description,
        verificador.type,
        verificador.url,
        verificador.logo,
        JSON.stringify(verificador.features),
        verificador.isActive
      ]);
      
      console.log(`✓ Insertado: ${verificador.name}`);
    }

    // Mostrar resumen
    const finalCount = await client.query('SELECT COUNT(*) FROM verificadores');
    console.log(`\n✅ Migración completada. ${finalCount.rows[0].count} verificadores insertados.`);
    
    // Mostrar datos insertados
    const insertedData = await client.query(`
      SELECT id, name, type, isactive, jsonb_array_length(features) as feature_count
      FROM verificadores 
      ORDER BY id
    `);
    
    console.log('\n📊 Datos insertados:');
    console.table(insertedData.rows);
    
    return true;

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando migración de verificadores a PostgreSQL\n');
    
    await createVerificadoresTable();
    await insertVerificadores();
    
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('💡 Ahora puedes usar el CMS para gestionar los verificadores');
    
  } catch (error) {
    console.error('\n💥 Error durante la migración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { createVerificadoresTable, insertVerificadores, verificadoresData };