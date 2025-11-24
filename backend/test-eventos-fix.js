// Test rápido para verificar el fix de eventos
const axios = require('axios');

const testEventoUpdate = async () => {
    const baseURL = 'http://localhost:4000/api';
    
    try {
        console.log('🧪 Iniciando test de eventos...');
        
        // 1. Datos con el esquema INCORRECTO (simulando el problema)
        const badData = {
            title: 'Test Evento',
            type: 'taller',
            startDate: '2025-11-20T10:00:00Z', // ❌ Campo problemático
            endDate: '2025-11-20T12:00:00Z',   // ❌ Campo problemático
            maxParticipants: 30,               // ❌ Campo problemático
            imageUrl: 'test.jpg',              // ❌ Campo problemático
            location: 'Test Location',
            description: 'Test Description',
            organizer: 'Test Organizer',
            status: 'upcoming'
        };
        
        console.log('📤 Enviando datos con campos problemáticos:', Object.keys(badData));
        
        // 2. Probar creación
        const createResponse = await axios.post(`${baseURL}/eventos`, badData);
        console.log('✅ Creación exitosa:', createResponse.data.success);
        
        if (!createResponse.data.success) {
            console.log('❌ Error en creación:', createResponse.data.message);
            return;
        }
        
        const eventoId = createResponse.data.data.id;
        console.log('🆔 ID del evento creado:', eventoId);
        
        // 3. Probar actualización con datos problemáticos
        const updateData = {
            ...badData,
            title: 'Test Evento ACTUALIZADO',
            startDate: '2025-11-25T10:00:00Z', // ❌ Sigue teniendo campo problemático
        };
        
        console.log('📤 Actualizando con campos problemáticos...');
        const updateResponse = await axios.put(`${baseURL}/eventos/${eventoId}`, updateData);
        console.log('✅ Actualización exitosa:', updateResponse.data.success);
        
        if (updateResponse.data.success) {
            console.log('🎉 TEST EXITOSO: El fix está funcionando!');
            console.log('📊 Datos finales:', updateResponse.data.data);
        } else {
            console.log('❌ Error en actualización:', updateResponse.data.message);
        }
        
        // 4. Limpiar - eliminar el evento de prueba
        await axios.delete(`${baseURL}/eventos/${eventoId}`);
        console.log('🧹 Evento de prueba eliminado');
        
    } catch (error) {
        console.log('❌ ERROR EN TEST:', error.response?.data || error.message);
    }
};

// Ejecutar el test
testEventoUpdate();