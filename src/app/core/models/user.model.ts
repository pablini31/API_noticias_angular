export interface UserData {
  id: number | string;
  perfil_id: number;
  nombre: string;
  apellidos: string;
  nick: string;
  correo: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  nombre: string;
  apellidos: string;
  nick: string;
  correo: string;
  contraseña: string;
  perfil_id: number;
  activo?: boolean;
}

export interface UpdateUserRequest {
  nombre?: string;
  apellidos?: string;
  nick?: string;
  contraseña?: string;
  perfil_id?: number;
  activo?: boolean;
}
