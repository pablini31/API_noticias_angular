import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map, mergeMap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id?: number;
  usuario_id?: number;
  userId?: number;
  correo: string;
  perfil_id?: number;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private authState$ = new BehaviorSubject<{ token: string | null; user: User | null }>({
    token: this.getStoredToken(),
    user: this.getStoredUser(),
  });

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  /**
   * Extrae el ID del usuario del JWT
   */
  private extractUserIdFromJwt(payload: JwtPayload): number | null {
    // Log completo de todo el payload
    console.log('📋 JWT Payload completo:', JSON.stringify(payload, null, 2));
    
    // Intenta obtener el ID de múltiples formas posibles
    // 1. Busca en propiedades top-level
    let id = payload.id ?? payload.usuario_id ?? payload.userId;
    
    // 2. Si no encuentra, intenta buscar en objeto 'usuario' anidado
    if (!id && (payload as any).usuario?.id) {
      id = (payload as any).usuario.id;
    }
    
    console.log('🔍 Valores encontrados en JWT:', {
      id: payload.id,
      usuario_id: payload.usuario_id,
      userId: payload.userId,
      usuarioId: (payload as any).usuario?.id,
      finalId: id
    });
    
    console.log('✅ ID extraído:', id);
    return id ? Number(id) : null;
  }

  /**
   * Login endpoint
   */
  login(credentials: LoginRequest): Observable<User> {
    console.group('🔐 LOGIN PROCESS STARTED');
    console.log('Email:', credentials.correo);
    console.log('Password length:', credentials.contraseña?.length);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        console.log('✅ Login successful, received token');
        console.log('Token:', response.token.substring(0, 30) + '...');
        this.setToken(response.token);
      }),
      map((response) => {
        // Decodificar JWT para obtener el userId
        try {
          const decoded = jwtDecode<JwtPayload>(response.token);
          console.log('🔓 JWT decoded:', decoded);
          
          // Verificar si el token no ha expirado
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            console.error('❌ Token already expired!');
            this.logout();
            throw new Error('Token expirado');
          }
          
          // Extraer el ID del usuario
          const userId = this.extractUserIdFromJwt(decoded);
          if (!userId) {
            console.error('❌ Could not extract user ID from JWT');
            throw new Error('No se pudo extraer el ID del usuario del JWT');
          }
          
          console.log('✅ Extracted userId:', userId);
          
          // Retornar el ID para continuar con fetch de datos del usuario
          return userId;
        } catch (error) {
          console.error('Error decoding JWT:', error);
          throw error;
        }
      }),
      mergeMap((userId: number) => this.fetchUserData(userId)),
      tap((user) => {
        console.log('✅ Login process completed successfully');
        console.log('User:', user);
        console.groupEnd();
      }),
      catchError((err) => {
        console.error('❌ Login error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message,
          errors: err.error?.errors,
          fullError: err
        });
        console.groupEnd();
        return throwError(() => err?.error?.message || 'Login failed');
      })
    );
  }

  /**
   * Register endpoint
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      catchError((err) => {
        console.error('Register error', err);
        return throwError(() => err?.error?.message || 'Registration failed');
      })
    );
  }

  /**
   * Logout (clear local storage)
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authState$.next({ token: null, user: null });
  }

  /**
   * Get current auth state
   */
  getAuthState$(): Observable<{ token: string | null; user: User | null }> {
    return this.authState$.asObservable();
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    console.log('🔑 getToken() called');
    
    // Primero intenta obtener del BehaviorSubject (en memoria)
    const tokenInMemory = this.authState$.getValue().token;
    console.log('Token in memory:', !!tokenInMemory);
    
    if (tokenInMemory) {
      console.log('✅ Returning token from memory');
      return tokenInMemory;
    }

    // Si no está en memoria, intenta obtener de localStorage
    console.log('Token not in memory, checking localStorage...');
    const storedToken = this.getStoredToken();
    
    if (storedToken) {
      console.warn('⚠️ Token found in localStorage but not in memory. Syncing...');
      // Sincronizar el token con el BehaviorSubject
      this.authState$.next({
        ...this.authState$.getValue(),
        token: storedToken,
      });
      console.log('✅ Token synced to memory, returning...');
      return storedToken;
    }
    
    console.warn('❌ NO TOKEN FOUND - Token not in memory or localStorage');
    return null;
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.authState$.getValue().user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is admin (perfil_id = 1)
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user ? user.perfil_id === 1 : false;
  }

  /**
   * Set token and update state
   */
  private setToken(token: string): void {
    console.group('🔐 Setting Token');
    console.log('Token to store:', token.substring(0, 30) + '...');
    console.log('Token length:', token.length);
    
    localStorage.setItem(this.tokenKey, token);
    
    // Verify it was stored
    const stored = localStorage.getItem(this.tokenKey);
    console.log('✅ Token stored:', !!stored);
    console.log('Stored token matches:', stored === token);
    
    this.authState$.next({
      ...this.authState$.getValue(),
      token,
    });
    
    console.log('Auth state updated with token');
    console.groupEnd();
  }

  /**
   * Restore session from localStorage
   */
  private restoreSession(): void {
    console.group('🔄 Restoring session from localStorage');
    
    const token = this.getStoredToken();
    console.log('Token found:', !!token);
    
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Token decoded successfully');
        
        // Verificar si el token no ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp ? decoded.exp - currentTime : -1;
        console.log('Token expires in (seconds):', expiresIn);
        
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn('⚠️ Token expired. Logging out...');
          this.logout();
          console.groupEnd();
          return;
        }
        
        // Restaurar usuario desde localStorage o fetch desde API
        const storedUser = this.getStoredUser();
        console.log('User found in localStorage:', !!storedUser);
        
        if (storedUser) {
          console.log('Restoring auth state with stored user');
          this.authState$.next({ token, user: storedUser });
          console.log('✅ Session restored successfully');
        } else {
          // Si no hay usuario en localStorage, fetch desde API
          console.log('No user in localStorage, fetching from API...');
          const userId = this.extractUserIdFromJwt(decoded);
          if (userId) {
            this.authState$.next({ token, user: null });
            this.fetchUserData(userId).subscribe({
              next: () => console.log('✅ User data fetched during session restore'),
              error: (err: any) => console.error('Error fetching user data on restore:', err)
            });
          }
        }
      } catch (error) {
        console.error('Invalid token:', error);
        this.logout();
      }
    } else {
      console.log('No token found in localStorage');
    }
    
    console.groupEnd();
  }

  /**
   * Fetch user data completo desde la API
   */
  private fetchUserData(userId: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      map(res => res.data),
      tap(user => {
        this.setUser(user);
      }),
      catchError(err => {
        console.error('Error fetching user data:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Get token from localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get user from localStorage
   */
  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Store user data
   */
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.authState$.next({
      ...this.authState$.getValue(),
      user,
    });
  }
}
