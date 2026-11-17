'use client';

import TiposNoticiaCMS from './TiposNoticiaCMS';
import { estadosEventoService } from '@/api';

const EstadosEventoCMS = () => (
  <TiposNoticiaCMS
    service={estadosEventoService}
    title="Estados de eventos"
    description="Administra los estados disponibles para los eventos."
    singularLabel="estado de evento"
  />
);

export default EstadosEventoCMS;
