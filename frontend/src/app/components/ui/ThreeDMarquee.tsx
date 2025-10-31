"use client";
import { ThreeDMarquee } from "./3d-marquee";

export function ThreeDMarqueeDemo({ className }: { className?: string }) {
  const images = [
    "/img/aboic.webp",
    "/img/anpb.webp", 
    "/img/boliviaverifica.webp",
    "/img/chequeabolivia.webp",
    "/img/FES.webp",
    "/img/fundacionaru.webp",
    "/img/fundacionconstruir.webp",
    "/img/deutsch.webp",
    "/img/coordinadora de la mujer.webp",
    "/img/guardiana.webp",
    "/img/fundacioninternetbolivia.webp",
    "/img/civerwarmis.webp",
    "/img/onumujeres.webp",
   "/img/FES.webp",
    "/img/muywaso.webp",
    "/img/ipicomumsa.webp",
    // Duplicamos algunas imágenes para tener suficientes para el efecto 3D
    "/img/aboic.webp",
    "/img/boliviaverifica.webp",
    "/img/chequeabolivia.webp",
    "/img/FES.webp",
    "/img/fundacionaru.webp",
    "/img/guardiana.webp",
    "/img/onumujeres.webp",
    "/img/fundacionaru.webp",
    "/img/muywaso.webp",
    "/img/ipicomumsa.webp",
    "/img/fundacionconstruir.webp",
    "/img/deutsch.webp",
    "/img/fundacioninternetbolivia.webp",
    "/img/civerwarmis.webp",
    "/img/anpb.webp"
  ];
  return (
    <div className={`mx-auto z-0 h-full w-full bg-black dark:bg-neutral-800 ${className || ''}`}>
      <ThreeDMarquee images={images} />
    </div>
  );
}
