"use client";

import { useState } from "react";
import { Footer } from "../components/layouts/footer";
import SimpleNavbar from "../components/layouts/simple-navbar";
import ContactoModal from "../components/ContactoModal";

// Importar componentes de recursos
import { RecursosHeroSection } from "./components/RecursosHeroSection";
import { GuiasElectoralesSection } from "./components/GuiasElectoralesSection";
import { VerificacionHechosSection } from "./components/VerificacionHechosSection";
import { PublicacionesSection } from "./components/PublicacionesSection";
import { MultimediaSection } from "./components/MultimediaSection";
import { NoticiasSection } from "./components/NoticiasSection";

export default function RecursosPage() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SimpleNavbar onContactClick={() => setShowContactoModal(true)} />
      
      {/* Main Content - Página de recursos */}
      <main>
        <RecursosHeroSection />
        <NoticiasSection />
        <GuiasElectoralesSection />
        <VerificacionHechosSection />
        <PublicacionesSection />
        <MultimediaSection />
        
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ContactoModal 
        open={showContactoModal} 
        onClose={() => setShowContactoModal(false)} 
      />
    </div>
  );
}
