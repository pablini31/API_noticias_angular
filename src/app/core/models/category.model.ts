export interface Category {
  id: number | string;
  nombre: string;
  descripcion: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
