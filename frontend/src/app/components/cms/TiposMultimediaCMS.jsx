'use client';

import TiposNoticiaCMS from './TiposNoticiaCMS';
import { tiposMultimediaService } from '@/api';

const TiposMultimediaCMS = () => (
  <TiposNoticiaCMS
    service={tiposMultimediaService}
    title="Tipos de multimedia"
    description="Administra los tipos disponibles para la multimedia."
    singularLabel="tipo de multimedia"
  />
);

export default TiposMultimediaCMS;
