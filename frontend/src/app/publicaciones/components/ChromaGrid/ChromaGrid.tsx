"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { publicacionesTendenciasService, getAssetUrl, type PublicacionTendencia } from "@/api";

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

// Función para convertir PublicacionTendencia a ChromaItem
const convertPublicacionToChromaItem = (publication: PublicacionTendencia, index: number): ChromaItem => {
  // Colores del proyecto - solo el borde, sin gradientes oscuros
  const colors = [
    { borderColor: "#CBA135" },
    { borderColor: "#DC2626" },
    { borderColor: "#059669" },
    { borderColor: "#7C3AED" },
    { borderColor: "#EA580C" },
    { borderColor: "#0284C7" },
  ];
  
  const colorScheme = colors[index % colors.length];
  
  return {
    image: getAssetUrl(publication.imagen || ''),
    title: publication.titulo,
    subtitle: publication.descripcion || '',
    handle: publication.autor ? `@${publication.autor}` : undefined,
    url: publication.url,
    borderColor: colorScheme.borderColor,
  };
};

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  
  // Estados para cargar datos desde el backend
  const [publicaciones, setPublicaciones] = useState<PublicacionTendencia[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar publicaciones de tendencias desde el backend
  useEffect(() => {
    const loadPublicaciones = async () => {
      try {
        setLoading(true);
        const response = await publicacionesTendenciasService.getAll();
        if (response.data) {
          setPublicaciones(response.data);
        }
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicaciones();
  }, []);

  // Convertir los datos de publicaciones de tendencias a ChromaItems
  const data = items?.length 
    ? items 
    : publicaciones.map((publication, index) => convertPublicacionToChromaItem(publication, index));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      {loading ? (
        // Estado de carga
        Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`loading-${i}`}
            className="chroma-card animate-pulse bg-gray-200 rounded-2xl"
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 + 1.2 }}
          >
            <div className="h-48 bg-gray-300 rounded-t-2xl"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 rounded"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </motion.div>
        ))
      ) : data.length > 0 ? (
        data.map((c, i) => (
        <motion.article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={
            {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,
              cursor: c.url ? "pointer" : "default",
            } as React.CSSProperties
          }
          initial={{ 
            opacity: 0, 
            y: 60,
            scale: 0.8,
            rotateX: 45
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1,
            rotateX: 0
          }}
          transition={{ 
            duration: 0.8,
            delay: i * 0.1 + 1.2, // Escalonado después de las animaciones de la página
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          whileHover={{ 
            scale: 1.05,
            y: -10,
            transition: { duration: 0.3 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
        >
          <div className="chroma-img-wrapper">
            <Image 
              src={c.image} 
              alt={c.title} 
              width={300}
              height={220}
              className="chroma-image"
              loading="lazy"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+") {
                  target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";
                }
              }}
            />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </motion.article>
        ))
      ) : (
        // Estado vacío
        <motion.div
          className="col-span-full text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            No hay publicaciones disponibles
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Las publicaciones de tendencias electorales aparecerán aquí una vez que sean agregadas desde el dashboard.
          </p>
        </motion.div>
      )}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </motion.div>
  );
};

export default ChromaGrid;
