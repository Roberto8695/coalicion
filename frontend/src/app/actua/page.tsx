"use client";

import { useState } from "react";
import { ReportsSection } from "./components/reports";
import { Footer } from "../components/layouts/footer";
import SimpleNavbar from "../components/layouts/simple-navbar";
import ContactoModal from "../components/ContactoModal";

export default function ActuaPage() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SimpleNavbar onContactClick={() => setShowContactoModal(true)} />

      {/* Main Content */}
      <main className="pt-20 lg:pt-28">
        {/* Reporta un Caso Section */}
        <ReportsSection />

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
