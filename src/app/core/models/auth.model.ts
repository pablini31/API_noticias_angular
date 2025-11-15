export interface LoginRequest {
  correo: string;
  contraseña: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  nick: string;
  correo: string;
  contraseña: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface User {
  id: string | number;
  perfil_id: number;
  nombre: string;
  apellidos: string;
  nick: string;
  correo: string;
  activo: boolean;
  bio?: string | null;
  avatar?: string | null;
  verificado?: boolean;
  ultima_actividad?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
