"use client";

import { useState, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import VerificationModal from "../VerificationModal";

const navigationItems = [
  { name: "Recursos", link: "/recursos", isContacto: false, isScroll: false },
  { name: "Sobre Nosotros", link: "/about-us", isContacto: false, isScroll: false },
  { name: "Actúa", link: "/actua", isContacto: false, isScroll: false },

  //{ name: "Contacto", link: "#", isContacto: true, isScroll: false },
];

interface SimpleNavbarProps {
  onContactClick?: () => void;
}

export default function SimpleNavbar({ onContactClick }: SimpleNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Obtener la altura real del navbar dinámicamente
      const navbar = document.querySelector('nav');
      let navbarHeight = 80; // fallback
      
      if (navbar) {
        navbarHeight = navbar.getBoundingClientRect().height;
      }
      
      // Usar un offset más grande negativo para mostrar más contenido hacia abajo
      const additionalOffset = -60; // Aumentado para mostrar más contenido abajo
      const totalOffset = navbarHeight + additionalOffset;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - totalOffset;
      
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent, item: typeof navigationItems[0]) => {
    if (item.isContacto && onContactClick) {
      e.preventDefault();
      onContactClick();
    } else if (item.isScroll) {
      e.preventDefault();
      if (item.link === "#home") {
        scrollToTop();
      } else {
        const sectionId = item.link.substring(1); // remove '#' from link
        scrollToSection(sectionId);
      }
    }
    // For regular links (like /reportes), let the default Link behavior handle it
    
    closeMobileMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element)?.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openVerificationModal = () => {
    setIsVerificationModalOpen(true);
  };

  const closeVerificationModal = () => {
    setIsVerificationModalOpen(false);
  };

  return (
    <nav
      className={`fixed  top-0 left-0 right-0 z-500 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-[#7b1e3c]/80 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-[#7b1e3c]/60 backdrop-blur-sm border-b border-white/5"
      }`}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        border: 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 lg:h-24 py-1 sm:py-2">
          {/* Logo izquierdo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center transform hover:scale-105 transition-transform duration-200">
              <Image
                src="/inicial/LogoM.webp"
                alt="FACTO - Coalición Nacional Contra la Desinformación Electoral"
                width={240}
                height={70}
                className="h-12 sm:h-20 lg:h-25  w-auto object-contain"
              />
            </Link>
          </div>

          {/* Espaciador flexible */}
          <div className="flex-1"></div>

          {/* Menú desktop en el lado derecho */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                onClick={(e) => handleNavClick(e, item)}
                className="group relative text-sm lg:text-base font-medium font-montserrat transition-all duration-300 px-2 py-2 text-white hover:text-[#cba135] transform hover:scale-105"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              >
                <span className="relative z-10 font-montserrat">{item.name}</span>
                {/* Línea animada debajo */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cba135] transition-all duration-300 group-hover:w-full"></div>
                {/* Efecto de brillo sutil */}
                
              </Link>
            ))}
            
            {/* Botón Verifica Desinformación */}
            <button
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white font-semibold font-montserrat text-sm lg:text-base rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-[#CBA135]/20 hover:border-[#CBA135]/40 backdrop-blur-sm"
              onClick={openVerificationModal}
            >
              Verifica Desinformación
            </button>
          </div>

          {/* Botón hamburguesa para móvil */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 transform hover:scale-110 active:scale-95 ml-2 sm:ml-4"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="relative">
              {isMobileMenuOpen ? (
                <IconX className="h-7 w-7 sm:h-6 sm:w-6 transition-all duration-300 rotate-180" />
              ) : (
                <IconMenu2 className="h-7 w-7 sm:h-6 sm:w-6 transition-all duration-300 rotate-0" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`lg:hidden  relative transition-all duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-96 opacity-60   translate-y-0"
            : "max-h-0 opacity-0  -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Fondo blur inmediato */}
        <div 
          className={`absolute  inset-0 backdrop-blur-lg transition-opacity duration-200 ${
            isMobileMenuOpen ? "opacity-100 ¡" : "opacity-0 bg-transparent"
          }`}
        />
        
        {/* Contenido del menú */}
        <div className="relative px-4  pt-4 pb-6 space-y-3 shadow-lg z-10">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={(e) => handleNavClick(e, item)}
              className={`group relative !border-b-1 font-medium font-montserrat flex items-center justify-center w-full px-4 py-3 text-base text-white hover:text-red-300 transition-all  duration-300 transform hover:scale-105 ${
                isMobileMenuOpen 
                  ? `animate-slideIn animation-delay-${index * 100}` 
                  : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                fontFamily: 'var(--font-montserrat), sans-serif'
              }}
            >
              <span className="relative z-10">{item.name}</span>
              {/* Línea animada lateral */}
              <div className="absolute left-4  top-1/2 w-0 h-0.5 bg-gradient-to-r from-red-400 to-rose-400 transition-all duration-300 group-hover:w-8 transform -translate-y-1/2"></div>
              {/* Línea animada derecha */}
              <div className="absolute right-4  top-1/2 w-0 h-0.5 bg-gradient-to-l from-red-400 to-rose-400 transition-all duration-300 group-hover:w-8 transform -translate-y-1/2"></div>
              {/* Efecto de brillo sutil */}
              <div className="absolute inset-0  rounded-lg opacity-0 bg-gradient-to-r from-red-800/10 to-rose-800/10 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          ))}
          
          {/* Botón Verifica Desinformación para móvil */}
          <div className="pt-4 border-t border-white/20">
            <button
              className={`w-full px-6 py-3 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white font-semibold font-montserrat text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border border-[#CBA135]/20 ${
                isMobileMenuOpen 
                  ? `animate-slideIn animation-delay-${navigationItems.length * 100}` 
                  : ''
              }`}
              style={{
                animationDelay: `${navigationItems.length * 100}ms`,
                fontFamily: 'var(--font-montserrat), sans-serif'
              }}
              onClick={openVerificationModal}
            >
              Verifica Desinformación
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Verificación */}
      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={closeVerificationModal} 
      />
    </nav>
  );
}
