'use client';

import { useState } from 'react';
import { eventosService } from '@/api/services';

export default function TestEventosAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('Probando conexión con eventos API...');
      const response = await eventosService.getAll({ limit: 5 });
      console.log('Respuesta del API:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      console.error('Error en la prueba:', err);
      setError((err as Error).message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const testCreate = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const testEvent = {
        title: 'Evento de Prueba CMS',
        type: 'taller' as const,
        date: new Date().toISOString(),
        time: '10:00 AM',
        location: 'Online',
        description: 'Este es un evento de prueba creado desde el CMS',
        duration: '2 horas',
        capacity: 25,
        organizer: 'Coalición por la Transparencia',
        status: 'upcoming' as const,
        slug: 'evento-prueba-cms-' + Date.now()
      };

      console.log('Creando evento de prueba:', testEvent);
      const response = await eventosService.create(testEvent);
      console.log('Evento creado:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      console.error('Error creando evento:', err);
      setError((err as Error).message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de API de Eventos</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Probando...' : 'Probar Obtener Eventos'}
        </button>
        
        <button
          onClick={testCreate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          {loading ? 'Creando...' : 'Probar Crear Evento'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Resultado:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}