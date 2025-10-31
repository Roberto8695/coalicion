"use client";

import React, { useState, useEffect } from "react";
import { IconDownload, IconShare, IconPhoto, IconPlayerPlay } from "@tabler/icons-react";
import Image from "next/image";
import { multimediaService } from "@/api";

interface MultimediaItem {
  id: number;
  title: string;
  description: string;
  type: "infografia" | "video" | "arte" | "presentacion";
  thumbnail?: string;
  downloadurl?: string;
  previewurl?: string;
  duration?: string;
  format: string;
  size: string;
  tags?: string[];
  featured: boolean;
  slug?: string;
  mediafile?: string;
}

// Función para obtener URL completa
const getFullUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Convertir URL relativa a URL completa del backend
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${baseUrl.replace('/api', '')}${url}`;
};

// Helper function to check if a URL is valid for images
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Reject URLs that point to dashboard
  if (url.includes('/dashboard')) {
    return false;
  }
  
  // Accept data URLs
  if (url.startsWith('data:image/')) {
    return true;
  }
  
  // Accept URLs with image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

// Get safe image URL
const getSafeImageUrl = (thumbnail?: string, previewurl?: string): string => {
  const placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+UHJldmlldyBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
  
  // Primero intentar con thumbnail, luego con previewurl
  const imageUrl = thumbnail || previewurl;
  
  if (imageUrl && isValidImageUrl(imageUrl)) {
    return getFullUrl(imageUrl);
  }
  
  return placeholder;
};

export function MultimediaSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMultimedia() {
      try {
        setLoading(true);
        const response = await multimediaService.getAll();
        if (response.success && response.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedData: MultimediaItem[] = (response.data as any[]).map((item) => ({
            id: item.id || 0,
            title: item.title || '',
            description: item.description || '',
            type: item.type || 'infografia',
            thumbnail: item.thumbnail,
            downloadurl: item.downloadurl,
            previewurl: item.previewurl,
            duration: item.duration,
            format: item.format || 'N/A',
            size: item.size || 'N/A',
            tags: Array.isArray(item.tags) ? item.tags : 
                  (typeof item.tags === 'string' && item.tags) ? 
                  item.tags.split(',').map((tag: string) => tag.trim()) : [],
            featured: Boolean(item.featured),
            slug: item.slug,
            mediafile: item.mediafile
          }));
          setMultimediaItems(mappedData);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading multimedia:', err);
        setError('Error al cargar los recursos multimedia');
      } finally {
        setLoading(false);
      }
    }

    fetchMultimedia();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "infografia": return "from-blue-600 to-blue-700";
      case "video": return "from-red-600 to-red-700";
      case "arte": return "from-purple-600 to-purple-700";
      case "presentacion": return "from-green-600 to-green-700";
      default: return "from-gray-600 to-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "infografia": return "Infografía";
      case "video": return "Video";
      case "arte": return "Arte";
      case "presentacion": return "Presentación";
      default: return "Multimedia";
    }
  };
  
  const categories = [
    { id: "all", label: "Todos" },
    { id: "infografia", label: "Infografías" },
    { id: "video", label: "Videos" },
    { id: "arte", label: "Arte" },
    { id: "presentacion", label: "Presentaciones" }
  ];

  const filteredItems = selectedCategory === "all" 
    ? multimediaItems 
    : multimediaItems.filter(item => item.type === selectedCategory);

  const handleDownload = async (url: string | undefined) => {
    if (!url) {
      alert('URL de descarga no válida o no disponible');
      return;
    }

    try {
      // Construir URL de descarga forzada
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // Extraer la ruta relativa del archivo
      let filePath = url;
      if (url.startsWith('/uploads/')) {
        filePath = url.replace('/uploads/', '');
      } else if (url.includes('/uploads/')) {
        filePath = url.split('/uploads/')[1];
      }
      
      // Parsear el path para obtener tipo, formato y nombre
      const pathParts = filePath.split('/');
      if (pathParts.length >= 3) {
        const type = pathParts[0];
        const format = pathParts[1];
        const filename = pathParts[2];
        
        const downloadUrl = `${baseUrl.replace('/api', '')}/api/uploads/download/${type}/${format}/${filename}`;
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('URL de archivo no válida');
      }
      
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  const handlePreview = (url: string | undefined) => {
    if (!url) {
      alert('Vista previa no disponible');
      return;
    }
    
    const fullUrl = getFullUrl(url);
    window.open(fullUrl, '_blank');
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135] mx-auto mb-4"></div>
            <p className="mt-4 text-lg text-gray-600">Cargando recursos multimedia...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <IconPhoto className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
            <p className="text-gray-600">Por favor, verifica la conexión al servidor.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="multimedia" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
            <span className="text-[#222426]">Recursos </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Multimedia
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-opensans">
            Explora nuestra colección de infografías, videos, arte y presentaciones sobre verificación electoral
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${ 
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#CBA135]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={getSafeImageUrl(item.thumbnail, item.previewurl)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play overlay for videos */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <IconPlayerPlay className="h-8 w-8 text-gray-800 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    {item.featured && (
                      <span className="text-[#CBA135] text-xs font-semibold">Destacado</span>
                    )}
                  </div>

                  <h3 className="text-lg font-montserrat font-bold text-[#222426] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 font-opensans text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.format}</span>
                    <span>{item.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(item.downloadurl)}
                      className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#B8941F] hover:to-[#CBA135] transition-all duration-300 text-sm"
                    >
                      <IconDownload className="h-4 w-4" />
                      Descargar
                    </button>
                    
                    <button
                      onClick={() => handlePreview(item.previewurl)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <IconShare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <IconPhoto className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay recursos multimedia disponibles
            </h3>
            <p className="text-gray-500">
              {selectedCategory === "all" 
                ? "Aún no se han cargado recursos multimedia."
                : `No hay recursos de tipo "${categories.find(c => c.id === selectedCategory)?.label}".`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}