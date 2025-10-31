"use client";

import { useState } from "react";
import { HeroSection } from "./components/layouts/hero-section";
import { SliderLogos } from "./components/layouts/slider-logos";
import { LatestNewsSection } from "./components/layouts/latest-news-section";
import { AgendaElectoralSection } from "./recursos/components/AgendaElectoralSection";
import { HowToParticipateSection } from "./components/layouts/how-to-participate-section";
import { PublicacionesCoalicionSeccion } from "./components/layouts/publicaciones-coalicion-seccion";
import { Footer } from "./components/layouts/footer";
import SimpleNavbar from "./components/layouts/simple-navbar";
import { FAQSection } from "./components/layouts/FAQ";
import ContactoModal from "./components/ContactoModal";

export default function InstitucionalPage() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SimpleNavbar onContactClick={() => setShowContactoModal(true)} />
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-28">
        {/* Hero Section */}
        <div id="home" className="-mt-20 sm:-mt-14 lg:-mt-28">
          <HeroSection />
        </div>

        {/* 1. Tendencias Electorales - Latest News Section */}
        <LatestNewsSection />
        
        {/* 2. Agenda Electoral */}
        <AgendaElectoralSection />
        
        {/* 3. Preguntas Frecuentes */}
        <FAQSection />
        
        {/* 4. Publicaciones */}
        <PublicacionesCoalicionSeccion />

        {/* 5. Miembros - Slider Logos Section */}
        <SliderLogos />
        
        {/* 6. Cómo participar */}
        <HowToParticipateSection />

        {/* Footer */}
        <Footer />
      </main>

      {/* Modals */}
      <ContactoModal 
        open={showContactoModal} 
        onClose={() => setShowContactoModal(false)} 
      />
    </div>
  );
}
