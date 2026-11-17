'use client';

import { useState } from 'react';
import CategoriasCMS from './CategoriasCMS';
import TiposPublicacionCMS from './TiposPublicacionCMS';
import CategoriasDocumentosElectoralesCMS from './CategoriasDocumentosElectoralesCMS';
import TiposNoticiaCMS from './TiposNoticiaCMS';
import TiposMultimediaCMS from './TiposMultimediaCMS';
import TiposEventoCMS from './TiposEventoCMS';
import EstadosEventoCMS from './EstadosEventoCMS';

const sections = [
  {
    id: 'categorias',
    label: 'Categorías generales',
    description: 'Categorías compartidas por publicaciones, noticias y multimedia.',
    component: CategoriasCMS
  },
  {
    id: 'tipos-publicacion',
    label: 'Tipos de publicación',
    description: 'Tipos disponibles para clasificar las publicaciones.',
    component: TiposPublicacionCMS
  },
  {
    id: 'categorias-documentos-electorales',
    label: 'Categorías de documentos',
    description: 'Categorías exclusivas del repositorio de documentos electorales.',
    component: CategoriasDocumentosElectoralesCMS
  },
  {
    id: 'tipos-noticia',
    label: 'Tipos de noticias',
    description: 'Tipos disponibles para clasificar las noticias.',
    component: TiposNoticiaCMS
  },
  {
    id: 'tipos-multimedia',
    label: 'Tipos de multimedia',
    description: 'Tipos disponibles para clasificar la multimedia.',
    component: TiposMultimediaCMS
  },
  {
    id: 'tipos-evento',
    label: 'Tipos de eventos',
    description: 'Tipos disponibles para clasificar eventos.',
    component: TiposEventoCMS
  },
  {
    id: 'estados-evento',
    label: 'Estados de eventos',
    description: 'Estados disponibles para el seguimiento de eventos.',
    component: EstadosEventoCMS
  }
];

const CategoriasTiposCMS = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const selectedSection = sections.find((section) => section.id === activeSection) || sections[0];
  const SelectedComponent = selectedSection.component;

  return (
    <div className="min-h-full min-w-0 bg-gray-900">
      <div className="border-b border-gray-700 bg-gray-800 px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Categorías y tipos</h1>
        <p className="mt-1 text-gray-300">
          Administra desde un solo lugar las opciones utilizadas por los formularios del CMS.
        </p>
      </div>

      <div className="border-b border-gray-700 bg-gray-800 px-4 lg:px-6">
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Gestores de categorías y tipos">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeSection === section.id
                  ? 'border-[#CBA135] text-[#CBA135]'
                  : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" aria-label={selectedSection.label}>
        <SelectedComponent />
      </div>
    </div>
  );
};

export default CategoriasTiposCMS;
