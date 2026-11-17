'use client';

import TiposNoticiaCMS from './TiposNoticiaCMS';
import { tiposEventoService } from '@/api';

const TiposEventoCMS = () => (
  <TiposNoticiaCMS
    service={tiposEventoService}
    title="Tipos de eventos"
    description="Administra los tipos disponibles para los eventos."
    singularLabel="tipo de evento"
  />
);

export default TiposEventoCMS;
