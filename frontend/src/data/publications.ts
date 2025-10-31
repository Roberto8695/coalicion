export interface Publication {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  url?: string;
}

export const publications: Publication[] = [
  {
    "id": "pub_1",
    "image": "/uploads/1757445939752_1-publicacion.webp",
    "title": "3 de 311 candidatos de Libre están registrados como militantes del MAS",
    "subtitle": "Seguidores de ChequeaBolivia solicitaron revisar la militancia de los candidatos que postularon a las Elecciones Generales 2025.",
    "handle": "@chequea",
    "url": "https://chequeabolivia.bo/3-de-311-candidatos-de-libre-estan-registrados-como-militantes-del-mas"
  },
  {
    "id": "pub_2",
    "image": "/uploads/1757446080348_2-publicacion.webp",
    "title": "Mayoría inédita de legisladoras en la gestión 2025-2030 refuerza el protagonismo político de las mujeres",
    "subtitle": "Los resultados oficiales de las Elecciones Generales 2025 revelan que el 52,4% de los escaños de la Asamblea Legislativa Plurinacional (ALP) será ocupado por mujeres.",
    "handle": "@BoliviaVerifica",
    "url": "https://boliviaverificaelecciones.bo/mayoria-inedita-de-legisladoras-en-la-gestion-2025-2030-refuerza-el-protagonismo-politico-de-las-mujeres/"
  },
  {
    "id": "pub_1757368021656_i7j5wxe3j",
    "image": "/uploads/1757446172534_3-publicacion.webp",
    "title": "Esposa de Lara y hermana de Quiroga asumirán como diputadas en la gestión 2025-2030",
    "subtitle": "Usuarios de redes sociales denuncian nepotismo. Al respecto, el TSE aclaró que «cuando se trata de cargos electos, no existe impedimento legal»",
    "handle": "@BoliviaVerifica",
    "url": "https://boliviaverificaelecciones.bo/esposa-de-lara-y-hermana-de-quiroga-asumiran-como-diputadas-en-la-gestion-2025-2030/"
  }
];
