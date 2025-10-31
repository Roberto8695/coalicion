'use client';
import { ClickToComponent } from 'click-to-react-component'
import { useState, useEffect } from 'react';
import { 
  publicacionesService, 
  categoriasService, 
  noticiasService, 
  multimediaService, 
  eventosService 
} from '@/api';

export const CMSDashboard = () => {
  const [stats, setStats] = useState({
    publicaciones: { total: 0, recent: 0 },
    categorias: { total: 0, active: 0 },
    noticias: { total: 0, recent: 0 },
    multimedia: { total: 0, recent: 0 },
    eventos: { total: 0, upcoming: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas básicas
      const [
        publicacionesRes,
        categoriasRes,
        noticiasRes,
        multimediaRes,
        eventosRes
      ] = await Promise.all([
        publicacionesService.getAll({ limit: 1 }),
        categoriasService.getAll({ limit: 1 }),
        noticiasService.getAll({ limit: 1 }),
        multimediaService.getAll({ limit: 1 }),
        eventosService.getAll({ limit: 1 })
      ]);

      setStats({
        publicaciones: {
          total: publicacionesRes.pagination?.total || 0,
          recent: 0 // Aquí podrías calcular los recientes
        },
        categorias: {
          total: categoriasRes.pagination?.total || 0,
          active: categoriasRes.pagination?.total || 0
        },
        noticias: {
          total: noticiasRes.pagination?.total || 0,
          recent: 0
        },
        multimedia: {
          total: multimediaRes.pagination?.total || 0,
          recent: 0
        },
        eventos: {
          total: eventosRes.pagination?.total || 0,
          upcoming: 0
        }
      });

      // Cargar elementos recientes (simulado)
      const recentPublicaciones = await publicacionesService.getAll({ limit: 5 });
      if (recentPublicaciones.success) {
        setRecentItems(recentPublicaciones.data.map(item => ({
          ...item,
          type: 'publicacion',
          typeName: 'Publicación'
        })));
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Publicaciones',
      value: stats.publicaciones.total,
      change: '+' + stats.publicaciones.recent,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      name: 'Categorías',
      value: stats.categorias.total,
      change: stats.categorias.active + ' activas',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      name: 'Noticias',
      value: stats.noticias.total,
      change: '+' + stats.noticias.recent,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    },
    {
      name: 'Multimedia',
      value: stats.multimedia.total,
      change: '+' + stats.multimedia.recent,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      name: 'Eventos',
      value: stats.eventos.total,
      change: stats.eventos.upcoming + ' próximos',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <ClickToComponent />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general del sistema de gestión de contenidos
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} p-3 rounded-md text-white`}>
                    {card.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className={`${
                    card.changeType === 'positive' ? 'text-green-600' :
                    card.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {card.changeType === 'positive' || card.changeType === 'negative' ? 'últimos 30 días' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="p-6">
            {recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.typeName} • {item.author || 'Sin autor'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Sin fecha'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay actividad reciente</p>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/cms/publicaciones"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Nueva Publicación
                  </span>
                </div>
              </a>
              
              <a
                href="/cms/categorias"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Nueva Categoría
                  </span>
                </div>
              </a>
              
              <a
                href="/cms/noticias"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Nueva Noticia
                  </span>
                </div>
              </a>
              
              <a
                href="/cms/eventos"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Nuevo Evento
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="mt-2 text-sm font-medium text-gray-900">API Backend</h4>
              <p className="text-sm text-green-600">Operativo</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0-2.21-3.582-4-8-4s-8 1.79-8 4z" />
                </svg>
              </div>
              <h4 className="mt-2 text-sm font-medium text-gray-900">Base de Datos</h4>
              <p className="text-sm text-green-600">Conectada</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="mt-2 text-sm font-medium text-gray-900">CMS</h4>
              <p className="text-sm text-blue-600">Activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};