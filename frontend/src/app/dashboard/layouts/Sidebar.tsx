"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import {
  IconArrowLeft,
  IconFileText,
  IconTags,
  IconNews,
  IconPhoto,
  IconCalendar,
 
  IconUsers,
  IconDashboard,
  IconTrendingUp,
  IconUsersGroup,
  IconUserCog,

  IconFileDescription
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/app/lib/utils";

interface SidebarLayoutProps {
  children?: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function SidebarDemo({ children, activeSection = 'dashboard', onSectionChange }: SidebarLayoutProps = {}) {
  const { logout } = useAuth();
  const { 
    canManageUsers, 
    canManageCategories
  } = usePermissions();
  
  // Función para manejar el logout
  const handleLogout = () => {
    // Limpiar la autenticación
    logout();
    
    // Usar window.location para forzar navegación completa y evitar verificaciones de React
    window.location.href = '/';
  };

  // Links base que todos pueden ver
  const baseLinks = [
    {
      label: "Dashboard",
      href: "#dashboard",
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }
  ];

  // Links de contenido (para lectores, editores y administradores)
  const contentLinks = [
    {
      label: "Publicaciones",
      href: "#publicaciones",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Publicaciones Tendencias E.",
      href: "#publicaciones-tendencias",
      icon: (
        <IconTrendingUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Publicaciones Coalición",
      href: "#publicaciones-coalicion",
      icon: (
        <IconUsersGroup className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Noticias",
      href: "#noticias",
      icon: (
        <IconNews className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Multimedia",
      href: "#multimedia",
      icon: (
        <IconPhoto className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Eventos",
      href: "#eventos",
      icon: (
        <IconCalendar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    
    {
      label: "Documentos Electorales",
      href: "#documentos-electorales",
      icon: (
        <IconFileDescription className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Verificadores",
      href: "#verificadores",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }
  ];

  // Links administrativos (solo para administradores)
  const adminLinks = [
    ...(canManageCategories ? [{
      label: "Categorías",
      href: "#categorias",
      icon: (
        <IconTags className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }] : []),
    ...(canManageUsers ? [{
      label: "Usuarios",
      href: "#usuarios",
      icon: (
        <IconUserCog className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }] : [])
  ];

  // Combinar todos los links según permisos
  const links = [...baseLinks, ...contentLinks, ...adminLinks];
  const todayLabel = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 md:flex-row dark:from-neutral-900 dark:via-slate-900 dark:to-neutral-950",
        "h-screen", // Cambiado a h-screen para ocupar toda la pantalla
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6 border-r border-white/60 bg-white/70 px-2 py-4 backdrop-blur-xl dark:border-neutral-700/70 dark:bg-neutral-900/70">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              <div className="mb-2 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 px-3 py-2 dark:border-sky-900/40 dark:from-sky-950/30 dark:to-emerald-950/20">
                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Panel CMS</p>
                <p className="mt-1 text-xs font-semibold text-neutral-800 dark:text-neutral-100">Actualizado: {todayLabel}</p>
              </div>

              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Navegacion</p>

              {links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => onSectionChange?.(link.href.replace('#', ''))}
                  className={`group/sidebar flex items-center justify-start gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === link.href.replace('#', '') 
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20 dark:from-sky-600 dark:to-emerald-600'
                      : 'text-neutral-700 hover:translate-x-1 hover:bg-white/90 hover:shadow-sm dark:text-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.icon}
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="!m-0 inline-block whitespace-pre !p-0 text-sm transition duration-150 group-hover/sidebar:translate-x-1"
                  >
                    {link.label}
                  </motion.span>
                </button>
              ))}
              
              {/* Botón de Logout personalizado */}
              <button
                onClick={handleLogout}
                className="group/sidebar mt-3 flex items-center justify-start gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-neutral-700 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:text-neutral-200 dark:hover:border-rose-700/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              >
                <IconArrowLeft className="h-5 w-5 shrink-0" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="!m-0 inline-block whitespace-pre !p-0 text-sm transition duration-150 group-hover/sidebar:translate-x-1"
                >
                  Logout
                </motion.span>
              </button>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Coalicion",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children ? <CustomContent>{children}</CustomContent> : <Dashboard />}
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-3 rounded-xl border border-white/70 bg-white/70 px-2 py-2 text-sm font-normal text-black shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/70"
    >
      <Image
        src="/favicon.webp"
        className="h-10 w-10 shrink-0 rounded-lg border border-sky-200/60 bg-white p-1 shadow-sm dark:border-sky-800/40 dark:bg-neutral-800"
        width={120}
        height={120}
        alt="Coalición Nacional Logo"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-semibold tracking-wide text-neutral-900 dark:text-neutral-100"
      >
        Coalición Nacional
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      aria-label="Coalicion Nacional"
      title="Coalicion Nacional"
      className="relative z-20 flex items-center space-x-2 rounded-xl border border-white/70 bg-white/70 px-2 py-2 text-sm font-normal text-black shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/70"
    >
      <Image
        src="/favicon.webp"
        className="h-6 w-6 shrink-0 rounded-sm"
        width={24}
        height={24}
        alt="Coalición Nacional Logo"
      />
    </a>
  );
};

// Componente para contenido personalizado
const CustomContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-3xl border border-white/70 bg-white/85 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-10 dark:border-neutral-700/80 dark:bg-neutral-900/85 dark:shadow-black/40">
        {children}
      </div>
    </div>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-3xl border border-white/70 bg-white/85 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-10 dark:border-neutral-700/80 dark:bg-neutral-900/85 dark:shadow-black/40">
        <div className="rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">Panel de control</p>
          <h2 className="mt-2 text-2xl font-semibold">Resumen general</h2>
          <p className="mt-1 text-sm text-white/90">Vista renovada para comparar claramente el antes y despues.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Publicaciones", value: "128", tone: "from-sky-50 to-sky-100 dark:from-sky-950/50 dark:to-sky-900/20" },
            { label: "Noticias", value: "42", tone: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/20" },
            { label: "Eventos", value: "17", tone: "from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/20" },
            { label: "Usuarios", value: "9", tone: "from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/20" }
          ].map((item) => (
            <div key={item.label} className={cn("rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-sm dark:border-neutral-700/60", item.tone)}>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid flex-1 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Actividad reciente</h3>
            <div className="mt-4 space-y-3">
              {["Nueva noticia publicada", "Evento actualizado", "Nuevo verificador agregado"].map((event) => (
                <div key={event} className="rounded-xl bg-neutral-100 px-3 py-2 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">{event}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Estado del sistema</h3>
            <div className="mt-4 space-y-4">
              {[
                { label: "Modulo 1", value: "70%", widthClass: "w-[70%]" },
                { label: "Modulo 2", value: "45%", widthClass: "w-[45%]" },
                { label: "Modulo 3", value: "88%", widthClass: "w-[88%]" }
              ].map((progress, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                    <span>{progress.label}</span>
                    <span>{progress.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <div className={cn("h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500", progress.widthClass)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Acciones rapidas</h3>
            <div className="mt-4 grid gap-2">
              {[
                { label: 'Crear publicacion', tone: 'from-sky-500 to-cyan-500' },
                { label: 'Subir multimedia', tone: 'from-emerald-500 to-teal-500' },
                { label: 'Programar evento', tone: 'from-amber-500 to-orange-500' },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={cn('rounded-xl bg-gradient-to-r px-3 py-2 text-left text-sm font-medium text-white shadow transition-transform duration-200 hover:scale-[1.01]', action.tone)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
