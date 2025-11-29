const express = require('express');
const { fixTriggerFunction } = require('../fix_trigger_production');

const router = express.Router();

// ENDPOINT TEMPORAL PARA ARREGLAR EL TRIGGER
// Este endpoint debe eliminarse después de usar
router.post('/fix-trigger-emergency', async (req, res) => {
    try {
        console.log('🚨 EJECUTANDO FIX DE TRIGGER DE EMERGENCIA');
        console.log('📅 Fecha:', new Date().toISOString());
        
        await fixTriggerFunction();
        
        console.log('✅ Fix de trigger completado exitosamente');
        
        res.json({
            success: true,
            message: 'Función trigger corregida exitosamente',
            timestamp: new Date().toISOString(),
            warning: 'Este endpoint debe eliminarse después de usar'
        });
    } catch (error) {
        console.error('❌ Error al ejecutar fix de trigger:', error);
        
        res.status(500).json({
            success: false,
            message: 'Error al ejecutar fix de trigger',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para verificar el estado del trigger
router.get('/verify-trigger', async (req, res) => {
    try {
        const { pool } = require('../config/db');
        
        // Verificar que la función existe
        const checkFunction = await pool.query(`
            SELECT routine_name, routine_definition 
            FROM information_schema.routines 
            WHERE routine_name = 'update_updated_at_column'
        `);
        
        // Verificar triggers en publicaciones_coalicion
        const checkTriggers = await pool.query(`
            SELECT trigger_name, event_manipulation, action_statement
            FROM information_schema.triggers 
            WHERE event_object_table = 'publicaciones_coalicion'
        `);
        
        res.json({
            success: true,
            function_exists: checkFunction.rows.length > 0,
            function_details: checkFunction.rows[0] || null,
            triggers: checkTriggers.rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error al verificar trigger:', error);
        
        res.status(500).json({
            success: false,
            message: 'Error al verificar trigger',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;