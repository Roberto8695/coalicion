'use client';

import { useState } from 'react';
import { PublicacionesCMS } from '@/app/components/cms/PublicacionesCMS';
import { CategoriasCMS } from '@/app/components/cms/CategoriasCMS';
import { NoticiasCMS } from '@/app/components/cms/NoticiasCMS';
import { MultimediaCMS } from '@/app/components/cms/MultimediaCMS';
import { EventosCMS } from '@/app/components/cms/EventosCMS';
import { GuiasElectoralesCMS } from '@/app/components/cms/GuiasElectoralesCMS';
import { VerificadoresCMS } from '@/app/components/cms/VerificadoresCMS';
import { CMSDashboard } from '@/app/components/cms/CMSDashboard';

export const CMSManager = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CMSDashboard />;
      case 'publicaciones':
        return <PublicacionesCMS />;
      case 'categorias':
        return <CategoriasCMS />;
      case 'noticias':
        return <NoticiasCMS />;
      case 'multimedia':
        return <MultimediaCMS />;
      case 'eventos':
        return <EventosCMS />;
      case 'guias-electorales':
        return <GuiasElectoralesCMS />;
      case 'verificadores':
        return <VerificadoresCMS />;
      default:
        return <CMSDashboard />;
    }
  };

  return {
    activeSection,
    setActiveSection,
    content: renderContent()
  };
};