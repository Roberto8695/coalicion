export interface Publication {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  url?: string;
}

export const publications: Publication[] = [
  {
    "id": "pub_1",
    "image": "/uploads/img1.jpg",
    "title": "Ciberwarmis",
    "subtitle": "EleccionesGenerales2025",
    "handle": "@ceres",
    "url": "https://www.facebook.com/100064127318311/posts/1168600968620803/?rdid=LsywSDKuyKCUu2t7#"
  },
  {
    "id": "pub_2",
    "image": "/uploads/img2.jpg",
    "title": "Ciberwarmis",
    "subtitle": "EleccionesGenerales2025",
    "handle": "@ciberwarmis"
  }
];
