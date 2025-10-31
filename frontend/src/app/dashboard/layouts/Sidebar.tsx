"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import {
  IconArrowLeft,

  IconFileText,
  IconTags,
  IconNews,
  IconPhoto,
  IconCalendar,
  IconBook,
  IconUsers,
  IconDashboard
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/app/lib/utils";

interface SidebarLayoutProps {
  children?: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function SidebarDemo({ children, activeSection = 'dashboard', onSectionChange }: SidebarLayoutProps = {}) {
  const router = useRouter();
  
  // Función para manejar el logout
  const handleLogout = () => {
    // Limpiar la sesión del localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Eliminar cookies de sesión
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'coalicion_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirigir a la página principal
    router.push('/');
  };

  const links = [
    {
      label: "Dashboard",
      href: "#dashboard",
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Publicaciones",
      href: "#publicaciones",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Categorías",
      href: "#categorias",
      icon: (
        <IconTags className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
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
      label: "Guías Electorales",
      href: "#guias-electorales",
      icon: (
        <IconBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Verificadores",
      href: "#verificadores",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen", // Cambiado a h-screen para ocupar toda la pantalla
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => onSectionChange?.(link.href.replace('#', ''))}
                  className={`flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md transition-colors ${
                    activeSection === link.href.replace('#', '') 
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
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
                className="flex items-center justify-start gap-2 group/sidebar py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md px-2 transition-colors"
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Componente para contenido personalizado
const CustomContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        {children}
      </div>
    </div>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
