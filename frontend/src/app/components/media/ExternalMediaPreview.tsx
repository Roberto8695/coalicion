"use client";

import { IconExternalLink, IconPhoto } from "@tabler/icons-react";

export type ExternalMediaType = "infografia" | "video" | "arte" | "presentacion";

interface ExternalMediaPreviewProps {
  url?: string;
  type: ExternalMediaType;
  title: string;
  thumbnail?: string;
  className?: string;
}

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;
const VIDEO_EXTENSION = /\.(m4v|mov|mp4|ogg|webm)(?:$|[?#])/i;
const PDF_EXTENSION = /\.pdf(?:$|[?#])/i;

export function isValidExternalUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getYouTubeEmbedUrl(url: URL) {
  const hostname = url.hostname.replace(/^www\./, "");
  let videoId = "";

  if (hostname === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    videoId = url.searchParams.get("v") ?? "";
    if (!videoId) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) videoId = parts[1] ?? "";
    }
  }

  return /^[\w-]{6,}$/.test(videoId)
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : null;
}

function getEmbeddableUrl(value: string) {
  const url = new URL(value);
  const youtubeUrl = getYouTubeEmbedUrl(url);
  if (youtubeUrl) return youtubeUrl;

  const hostname = url.hostname.replace(/^www\./, "");
  if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
    const videoId = url.pathname.split("/").filter(Boolean).reverse().find((part) => /^\d+$/.test(part));
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }

  const driveMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (hostname === "drive.google.com" && driveMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  const slidesMatch = url.pathname.match(/\/presentation\/d\/([^/]+)/);
  if (hostname === "docs.google.com" && slidesMatch?.[1]) {
    return `https://docs.google.com/presentation/d/${slidesMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  if (hostname.endsWith("canva.com") && url.pathname.includes("/design/")) {
    url.searchParams.set("embed", "");
    return url.toString();
  }

  return value;
}

export function ExternalMediaPreview({
  url,
  type,
  title,
  thumbnail,
  className = "",
}: ExternalMediaPreviewProps) {
  const source = isValidExternalUrl(url) ? url : undefined;
  const fallbackImage = isValidExternalUrl(thumbnail) ? thumbnail : undefined;

  if (!source) {
    return (
      <div className={`flex h-full min-h-48 items-center justify-center bg-gray-100 text-gray-500 ${className}`}>
        <div className="text-center">
          <IconPhoto className="mx-auto h-10 w-10" aria-hidden="true" />
          <p className="mt-2 text-sm">Vista previa no disponible</p>
        </div>
      </div>
    );
  }

  const isImage = IMAGE_EXTENSION.test(source);
  const isDirectVideo = VIDEO_EXTENSION.test(source);
  const isPdf = PDF_EXTENSION.test(source);

  if (isImage) {
    return (
      // Se usa img porque las URLs son configurables y pueden pertenecer a cualquier dominio externo.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={source} alt={title} loading="lazy" referrerPolicy="no-referrer" className={`h-full w-full object-contain ${className}`} />
    );
  }

  if (type === "video" && isDirectVideo) {
    return (
      <video
        src={source}
        controls
        preload="metadata"
        poster={fallbackImage}
        className={`h-full w-full bg-black object-contain ${className}`}
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    );
  }

  if (isPdf || type === "video" || type === "presentacion" || type === "infografia" || type === "arte") {
    return (
      <div className={`h-full min-h-48 w-full bg-gray-900 ${className}`}>
        <iframe
          src={getEmbeddableUrl(source)}
          title={`Vista previa de ${title}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full min-h-48 w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={`flex h-full min-h-48 items-center justify-center bg-gray-100 text-gray-600 ${className}`}>
      <IconExternalLink className="h-8 w-8" aria-hidden="true" />
    </div>
  );
}
