"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormPublications } from "./FormPublications";
import { Publication } from "@/data/publications";

export function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

  const handleCreatePublication = async (newPublication: Publication) => {
    try {
      // La API ya maneja la creación, no necesitamos hacerlo aquí
      setShowForm(false);
      
      // Recargar publicaciones desde la API
      await loadPublications();
      
      console.log("Nueva publicación creada:", newPublication);
    } catch (error) {
      console.error("Error al crear publicación:", error);
    }
  };

  const handleEditPublication = async (updatedPublication: Publication) => {
    try {
      // La API ya maneja la actualización, no necesitamos hacerlo aquí
      setEditingPublication(null);
      setShowForm(false);
      
      // Recargar publicaciones desde la API
      await loadPublications();
      
      console.log("Publicación actualizada:", updatedPublication);
    } catch (error) {
      console.error("Error al actualizar publicación:", error);
    }
  };

  const handleDeletePublication = async (publicationToDelete: Publication) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        const response = await fetch(`/api/publications?id=${encodeURIComponent(publicationToDelete.id || '')}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          // Recargar publicaciones desde la API
          await loadPublications();
          console.log("Publicación eliminada:", result.data);
        } else {
          alert(`Error al eliminar: ${result.error}`);
        }
      } catch (error) {
        console.error("Error al eliminar publicación:", error);
        alert("Error de conexión al eliminar la publicación");
      }
    }
  };

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/publications');
      const result = await response.json();

      if (result.success) {
        setPublications(result.data);
      } else {
        console.error("Error al cargar publicaciones:", result.error);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    loadPublications();
  }, []);

  const startEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPublication(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={cancelForm}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>
        </div>
        
        <FormPublications
          onSubmit={editingPublication ? handleEditPublication : handleCreatePublication}
          initialData={editingPublication || undefined}
          isEditing={!!editingPublication}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Publicaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra las publicaciones del sitio web
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg 
            transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Publicación
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Publicaciones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{publications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Con Enlaces</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {publications.filter(pub => pub.url).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Con Autores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {publications.filter(pub => pub.handle).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lista de Publicaciones
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {publications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay publicaciones</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comienza creando tu primera publicación.
              </p>
            </div>
          ) : (
            publications.map((publication, index) => (
              <div key={index} className="px-6 py-4 flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <Image
                    src={publication.image}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjRmNGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5JbWFnZW48L3RleHQ+PC9zdmc+") {
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjRmNGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5JbWFnZW48L3RleHQ+PC9zdmc+";
                      }
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {publication.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {publication.subtitle}
                  </p>
                  {publication.handle && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      @{publication.handle}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {publication.url && (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver publicación original"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  
                  <button
                    onClick={() => startEdit(publication)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    title="Editar publicación"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDeletePublication(publication)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Eliminar publicación"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
