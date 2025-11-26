'use client';

import { useState } from 'react';
import { PublicacionesCMS } from '@/app/components/cms/PublicacionesCMS';
import { PublicacionesTendenciasCMS } from '@/app/components/cms/PublicacionesTendenciasCMS';
import { PublicacionesCoalicionCMS } from '@/app/components/cms/PublicacionesCoalicionCMS';
import { CategoriasCMS } from '@/app/components/cms/CategoriasCMS';
import { NoticiasCMS } from '@/app/components/cms/NoticiasCMS';
import { MultimediaCMS } from '@/app/components/cms/MultimediaCMS';
import { EventosCMS } from '@/app/components/cms/EventosCMS';
import { GuiasElectoralesCMS } from '@/app/components/cms/GuiasElectoralesCMS';
import { VerificadoresCMS } from '@/app/components/cms/VerificadoresCMS';
import { CMSDashboard } from '@/app/components/cms/CMSDashboard';
import { UsuariosCMS } from './UsuariosCMS';
import { DocumentosElectoralesCMS } from '@/app/components/cms/DocumentosElectoralesCMS';

export const CMSManager = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CMSDashboard />;
      case 'publicaciones':
        return <PublicacionesCMS />;
      case 'publicaciones-tendencias':
        return <PublicacionesTendenciasCMS />;
      case 'publicaciones-coalicion':
        return <PublicacionesCoalicionCMS />;
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
      case 'documentos-electorales':
        return <DocumentosElectoralesCMS />;
      case 'verificadores':
        return <VerificadoresCMS />;
      case 'usuarios':
        return <UsuariosCMS />;
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