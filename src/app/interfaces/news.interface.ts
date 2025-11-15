export interface News {
  id?: number | string;
  categoria_id: number;
  estado_id: number;
  usuario_id: number;
  titulo: string;
  slug?: string;
  fecha_publicacion: string;
  descripcion: string;
  imagen: string; // base64
  estado_publicacion?: string; // borrador | publicado | archivado
  visitas?: number;
  comentarios_count?: number;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoria?: {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
  };
  estado?: {
    id: number;
    nombre: string;
    abreviacion: string;
    activo: boolean;
  };
  usuario?: {
    id: number;
    nombre: string;
    apellidos: string;
    nick: string;
    correo: string;
    avatar?: string | null;
  };
}

export interface CreateNewsRequest {
  categoria_id: number;
  estado_id: number;
  titulo: string;
  slug?: string;
  fecha_publicacion: string;
  descripcion: string;
  imagen: string;
  estado_publicacion?: string; // borrador | publicado | archivado
  activo?: boolean;
}

export interface UpdateNewsRequest {
  categoria_id?: number;
  estado_id?: number;
  titulo?: string;
  slug?: string;
  fecha_publicacion?: string;
  descripcion?: string;
  imagen?: string;
  estado_publicacion?: string;
  activo?: boolean;
}
