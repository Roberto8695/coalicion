'use client';

import React, { useState } from 'react';

export default function EmergencyFixPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const executeFix = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/emergency/fix-trigger-emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({
        success: false,
        message: 'Error de conexión',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyTrigger = async () => {
    setLoading(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch('/api/emergency/verify-trigger');
      const data = await response.json();
      setVerificationResult(data);
    } catch (err) {
      setVerificationResult({
        success: false,
        message: 'Error al verificar trigger',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-red-400 mb-4">🚨 Emergency Database Fix</h1>
          <p className="text-red-300 mb-4">
            Esta página es <strong>TEMPORAL</strong> para arreglar el trigger de la base de datos en producción.
          </p>
          <p className="text-red-300">
            <strong>IMPORTANTE:</strong> Esta página debe eliminarse después de usar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Verificar Estado */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">1. Verificar Estado del Trigger</h2>
            <button
              onClick={verifyTrigger}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Verificando...' : 'Verificar Trigger'}
            </button>
            
            {verificationResult && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Ejecutar Fix */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">2. Ejecutar Fix del Trigger</h2>
            <button
              onClick={executeFix}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Ejecutando Fix...' : '🚨 Ejecutar Fix Emergency'}
            </button>
            
            {result && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-600 rounded-lg">
                <h3 className="text-green-400 font-medium mb-2">✅ Fix Ejecutado Exitosamente</h3>
                <pre className="text-sm text-green-300 overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-600 rounded-lg">
                <h3 className="text-red-400 font-medium mb-2">❌ Error</h3>
                <pre className="text-sm text-red-300 overflow-x-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
          <h3 className="text-yellow-400 font-medium mb-2">⚠️ Instrucciones de Uso</h3>
          <ol className="text-yellow-300 space-y-2">
            <li><strong>1.</strong> Primero haz clic en &quot;Verificar Trigger&quot; para ver el estado actual</li>
            <li><strong>2.</strong> Si ves errores en la función, haz clic en &quot;Ejecutar Fix Emergency&quot;</li>
            <li><strong>3.</strong> Después del fix, verifica nuevamente para confirmar que funciona</li>
            <li><strong>4.</strong> Prueba actualizar una publicación en el CMS</li>
            <li><strong>5.</strong> <strong>ELIMINA esta página después de usar</strong></li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/dashboard"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}