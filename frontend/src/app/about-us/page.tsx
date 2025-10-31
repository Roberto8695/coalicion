"use client";

import { useState } from "react";
import { AboutHeroSection } from "../components/layouts/about-hero-section";
import { IndicadoresSection } from "../components/layouts/indicadores-section";
import MissionVisionSection from "../components/layouts/mission-vision-section";
import { Footer } from "../components/layouts/footer";
import SimpleNavbar from "../components/layouts/simple-navbar";
import ContactoModal from "../components/ContactoModal";

export default function AboutUs() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SimpleNavbar onContactClick={() => setShowContactoModal(true)} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <AboutHeroSection />

        {/* About Section - Indicadores */}
        <IndicadoresSection />

        {/* Mission, Vision & Objectives Section - Nuestra Propuesta */}
        <MissionVisionSection />

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
