'use client';

import { useState } from 'react';

export default function DebugEventoUpdate() {
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectUpdate = async () => {
    setLoading(true);
    setResultado('');

    try {
      // Datos completamente limpios y específicos
      const testData = {
        title: 'Evento de Prueba Debug',
        type: 'taller',
        date: '2025-11-20T10:00:00.000Z',
        time: '10:00 AM',
        location: 'Online',
        description: 'Descripción de prueba',
        duration: '2 horas',
        capacity: 25,
        registrationUrl: 'https://example.com',
        slug: 'evento-debug-' + Date.now(),
        organizer: 'Test',
        status: 'upcoming',
        image: '',
        requirements: ''
      };

      console.log('Enviando datos de prueba:', testData);

      // Primero probar la ruta de debug
      const debugResponse = await fetch('http://localhost:4000/api/eventos/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const debugResult = await debugResponse.json();
      console.log('Resultado de debug:', debugResult);

      // Crear un evento
      const createResponse = await fetch('http://localhost:4000/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const createResult = await createResponse.json();
      console.log('Resultado de creación:', createResult);

      if (!createResult.success) {
        setResultado('Error en creación: ' + createResult.message);
        setLoading(false);
        return;
      }

      // Ahora intentar actualizarlo
      const updateData = {
        ...testData,
        title: 'Evento de Prueba Debug ACTUALIZADO',
        description: 'Descripción actualizada'
      };

      console.log('Actualizando evento con ID:', createResult.data.id);
      console.log('Datos de actualización:', updateData);

      const updateResponse = await fetch(`http://localhost:4000/api/eventos/${createResult.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const updateResult = await updateResponse.json();
      console.log('Resultado de actualización:', updateResult);

      setResultado(JSON.stringify({
        debug: debugResult,
        create: createResult,
        update: updateResult
      }, null, 2));

    } catch (error) {
      console.error('Error en test:', error);
      setResultado('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug: Prueba de Actualización de Eventos</h1>
      
      <button
        onClick={testDirectUpdate}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded disabled:opacity-50 mb-6"
      >
        {loading ? 'Probando...' : 'Probar Crear → Actualizar Evento'}
      </button>

      {resultado && (
        <div className="bg-gray-100 border border-gray-300 p-4 rounded">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {resultado}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">Instrucciones:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Abre las herramientas de desarrollador (F12)</li>
          <li>Ve a la pestaña Console</li>
          <li>Haz clic en el botón de prueba</li>
          <li>Revisa los logs en la consola del navegador Y en los logs del backend</li>
          <li>El resultado te dirá exactamente dónde está el problema</li>
        </ol>
      </div>
    </div>
  );
}