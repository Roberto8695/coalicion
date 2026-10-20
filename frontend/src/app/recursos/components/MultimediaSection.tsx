"use client";

import { useEffect, useState } from "react";
import { IconExternalLink, IconPhoto } from "@tabler/icons-react";
import { multimediaService } from "@/api";
import {
  ExternalMediaPreview,
  type ExternalMediaType,
  isValidExternalUrl,
} from "@/app/components/media/ExternalMediaPreview";

interface MultimediaItem {
  id: number;
  title: string;
  description: string;
  type: ExternalMediaType;
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

const getFullUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return `${baseUrl.replace("/api", "")}${url}`;
};

export function MultimediaSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMultimedia() {
      try {
        setLoading(true);
        const response = await multimediaService.getAll();
        if (response.success && response.data) {
          const mappedData: MultimediaItem[] = response.data.map((item) => ({
            id: item.id || 0,
            title: item.title || "",
            description: item.description || "",
            type: item.type || "infografia",
            thumbnail: item.thumbnail || item.thumbnailUrl,
            downloadurl: item.downloadurl || item.url,
            previewurl: item.previewurl,
            duration: item.duration,
            format: item.format || "En línea",
            size: item.size || item.fileSize || "",
            tags: Array.isArray(item.tags)
              ? item.tags
              : typeof item.tags === "string" && item.tags
                ? item.tags.split(",").map((tag: string) => tag.trim())
                : [],
            featured: Boolean(item.featured),
            slug: item.slug,
            mediafile: item.mediafile,
          }));
          setMultimediaItems(mappedData);
        }
        setError(null);
      } catch (fetchError) {
        console.error("Error loading multimedia:", fetchError);
        setError("Error al cargar los recursos multimedia");
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
    { id: "presentacion", label: "Presentaciones" },
  ];

  const filteredItems = selectedCategory === "all"
    ? multimediaItems
    : multimediaItems.filter((item) => item.type === selectedCategory);

  const handleOpenResource = (url?: string) => {
    const fullUrl = getFullUrl(url);
    if (!isValidExternalUrl(fullUrl)) return;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#CBA135]" />
            <p className="mt-4 text-lg text-gray-600">Cargando recursos multimedia...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <IconPhoto className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <div className="mb-4 text-lg font-semibold text-red-500">{error}</div>
            <p className="text-gray-600">Por favor, verifica la conexión al servidor.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="multimedia" className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold font-montserrat sm:text-5xl lg:text-6xl">
            <span className="text-[#222426]">Recursos </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">Multimedia</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 font-opensans">
            Explora nuestra colección de infografías, videos, arte y presentaciones sobre verificación electoral
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={selectedCategory === category.id}
              className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${selectedCategory === category.id
                ? "bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white shadow-lg"
                : "border border-gray-200 bg-white text-gray-700 hover:border-[#CBA135] hover:bg-gray-50"}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const resourceUrl = item.downloadurl || item.previewurl;
              const previewUrl = getFullUrl(item.previewurl || item.downloadurl);
              const thumbnailUrl = item.thumbnail ? getFullUrl(item.thumbnail) : undefined;

              return (
                <article key={item.id} className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="h-52 overflow-hidden bg-gray-200">
                    <ExternalMediaPreview
                      url={previewUrl}
                      type={item.type}
                      title={item.title}
                      thumbnail={thumbnailUrl}
                      className="transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${getTypeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      {item.featured && <span className="text-xs font-semibold text-[#CBA135]">Destacado</span>}
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-[#222426] font-montserrat">{item.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 font-opensans">{item.description}</p>
                    <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{item.format}</span>
                      {item.size && <span>{item.size}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenResource(resourceUrl)}
                      disabled={!resourceUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#CBA135] to-[#B8941F] px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-[#B8941F] hover:to-[#CBA135] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <IconExternalLink className="h-4 w-4" aria-hidden="true" />
                      {item.type === "video" ? "Ver video" : "Ver recurso"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <IconPhoto className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-600">No hay recursos multimedia disponibles</h3>
            <p className="text-gray-500">
              {selectedCategory === "all"
                ? "Aún no se han agregado recursos multimedia."
                : `No hay recursos de tipo "${categories.find((category) => category.id === selectedCategory)?.label}".`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
