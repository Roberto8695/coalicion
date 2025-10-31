"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Publication } from "@/data/publications";

// Tipo para el formulario sin el ID (se genera automáticamente)
type PublicationFormData = Omit<Publication, 'id'>;

interface FormPublicationsProps {
  onSubmit: (publication: Publication) => void;
  initialData?: Publication;
  isEditing?: boolean;
}

export function FormPublications({ 
  onSubmit, 
  initialData, 
  isEditing = false 
}: FormPublicationsProps) {
  const [formData, setFormData] = useState<PublicationFormData>({
    image: initialData?.image || "",
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    handle: initialData?.handle || "",
    url: initialData?.url || "",
  });

  const [errors, setErrors] = useState<Partial<PublicationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof PublicationFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP, GIF'
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'El archivo es demasiado grande. Máximo 5MB'
      }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, image: "" }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          image: result.url
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          image: result.error || 'Error al subir el archivo'
        }));
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setErrors(prev => ({
        ...prev,
        image: 'Error de conexión al subir el archivo'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PublicationFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "El subtítulo es obligatorio";
    }

    if (!formData.image.trim()) {
      newErrors.image = "La imagen es obligatoria";
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = "Por favor ingresa una URL válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Llamar a la API para crear/actualizar publicación
      const endpoint = '/api/publications';
      const method = isEditing ? 'PUT' : 'POST';
      
      const body = isEditing 
        ? { id: initialData?.id, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await onSubmit(result.data);
        
        // Resetear formulario si no estamos editando
        if (!isEditing) {
          setFormData({
            image: "",
            title: "",
            subtitle: "",
            handle: "",
            url: "",
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } else {
        setErrors(prev => ({
          ...prev,
          title: result.error || 'Error al procesar la solicitud'
        }));
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setErrors(prev => ({
        ...prev,
        title: 'Error de conexión. Inténtalo de nuevo.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditing ? "Editar Publicación" : "Nueva Publicación"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing 
            ? "Modifica los datos de la publicación" 
            : "Completa los campos para crear una nueva publicación"
          }
        </p>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Campo Título */}
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 
              ${errors.title 
                ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } 
              dark:border-gray-600 dark:bg-gray-700 dark:text-white 
              focus:outline-none focus:ring-2`}
            placeholder="Ingresa el título de la publicación"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Campo Subtítulo */}
        <div>
          <label 
            htmlFor="subtitle" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Subtítulo <span className="text-red-500">*</span>
          </label>
          <textarea
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 resize-none
              ${errors.subtitle 
                ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } 
              dark:border-gray-600 dark:bg-gray-700 dark:text-white 
              focus:outline-none focus:ring-2`}
            placeholder="Describe brevemente el contenido de la publicación"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.subtitle}
            </p>
          )}
        </div>

        {/* Campo Imagen */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Imagen <span className="text-red-500">*</span>
          </label>
          
          {/* Selector de método de carga */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={uploadMethod === 'file'}
                  onChange={(e) => setUploadMethod(e.target.value as 'file' | 'url')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Subir archivo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={uploadMethod === 'url'}
                  onChange={(e) => setUploadMethod(e.target.value as 'file' | 'url')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">URL externa</span>
              </label>
            </div>
          </div>

          {uploadMethod === 'file' ? (
            <div>
              <div
                className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-colors duration-200 text-center cursor-pointer
                  ${errors.image 
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                    : "border-gray-300 hover:border-blue-400 dark:border-gray-600"
                  } 
                  dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600 dark:text-blue-400">Subiendo imagen...</span>
                  </div>
                ) : formData.image ? (
                  <div className="text-green-600 dark:text-green-400">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Imagen cargada correctamente</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Haz clic para cambiar la imagen
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-gray-400">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>Haz clic para seleccionar una imagen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPG, PNG, WebP, GIF (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 
                ${errors.image 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                } 
                dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                focus:outline-none focus:ring-2`}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          )}
          
          {errors.image && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.image}
            </p>
          )}
          
          {uploadMethod === 'url' && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Puedes usar una ruta local (/images/...) o una URL completa
            </p>
          )}
        </div>

        {/* Campo Handle */}
        <div>
          <label 
            htmlFor="handle" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Handle del Autor
          </label>
          <input
            type="text"
            id="handle"
            name="handle"
            value={formData.handle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
              dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="nombre_usuario"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Nombre de usuario o handle del autor (opcional)
          </p>
        </div>

        {/* Campo URL */}
        <div>
          <label 
            htmlFor="url" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            URL de la Publicación
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 
              ${errors.url 
                ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } 
              dark:border-gray-600 dark:bg-gray-700 dark:text-white 
              focus:outline-none focus:ring-2`}
            placeholder="https://www.facebook.com/usuario/posts/123456"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.url}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enlace directo a la publicación original (opcional)
          </p>
        </div>

        {/* Vista previa de la imagen */}
        {formData.image && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Vista Previa
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="relative w-full h-32 mb-3">
                <Image
                  src={formData.image}
                  alt="Vista previa"
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+") {
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";
                    }
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {formData.title || "Título de la publicación"}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 overflow-hidden" 
                 style={{
                   display: '-webkit-box',
                   WebkitLineClamp: 2,
                   WebkitBoxOrient: 'vertical' as const
                 }}>
                {formData.subtitle || "Subtítulo de la publicación"}
              </p>
              {formData.handle && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  @{formData.handle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 
              ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } 
              text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting 
              ? "Procesando..." 
              : isEditing 
                ? "Actualizar Publicación" 
                : "Crear Publicación"
            }
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 
              text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}