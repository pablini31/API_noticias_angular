import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

export interface Favorite {
  id: number;
  usuario_id: number;
  noticia_id: number;
  createdAt: string;
  updatedAt: string;
  noticia?: {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    fecha_publicacion: string;
  };
  usuario?: {
    id: number;
    nombre: string;
    apellidos: string;
    nick: string;
    avatar?: string | null;
  };
}

export interface FavoriteCheckResponse {
  isFavorited: boolean;
}

export interface FavoriteCountResponse {
  count: number;
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Agregar noticia a favoritos
   * POST /users/:usuarioId/favorites/:noticiaId
   */
  addFavorite(usuarioId: number | string, noticiaId: number | string): Observable<Favorite> {
    return this.http.post<any>(`${this.apiUrl}/users/${usuarioId}/favorites/${noticiaId}`, {}).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Error adding favorite:', err);
        return throwError(() => err?.error?.message || 'Error al agregar favorito');
      })
    );
  }

  /**
   * Remover noticia de favoritos
   * DELETE /users/:usuarioId/favorites/:noticiaId
   */
  removeFavorite(usuarioId: number | string, noticiaId: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${usuarioId}/favorites/${noticiaId}`).pipe(
      catchError((err) => {
        console.error('Error removing favorite:', err);
        return throwError(() => err?.error?.message || 'Error al remover favorito');
      })
    );
  }

  /**
   * Obtener favoritos de un usuario
   * GET /users/:usuarioId/favorites
   */
  getUserFavorites(usuarioId: number | string): Observable<Favorite[]> {
    return this.http.get<any>(`${this.apiUrl}/users/${usuarioId}/favorites`).pipe(
      tap((res: any) => {
        console.log('📊 Favorites API Response:', res);
      }),
      map((res: any) => {
        console.log('🔄 Mapping favorites response...');
        console.log('Response structure:', { success: res?.success, hasData: !!res?.data, isArray: Array.isArray(res?.data) });
        
        if (res && res.data && Array.isArray(res.data)) {
          console.log('✅ Returning res.data with', res.data.length, 'favorites');
          return res.data;
        }
        if (Array.isArray(res)) {
          console.log('✅ Returning direct array with', res.length, 'favorites');
          return res;
        }
        console.log('⚠️ No valid data found, returning empty array');
        return [];
      }),
      catchError((err: any) => {
        console.error('❌ Error fetching user favorites:', err);
        console.error('Error details:', {
          status: err?.status,
          message: err?.error?.message,
          fullError: err?.error
        });
        return throwError(() => err?.error?.message || 'Error al cargar favoritos');
      })
    );
  }

  /**
   * Obtener favoritos de un usuario - VERSIÓN SIMPLIFICADA (workaround para error backend)
   * Intenta primero con el endpoint normal, si falla devuelve array vacío
   * GET /users/:usuarioId/favorites
   */
  getUserFavoritesSimplified(usuarioId: number | string): Observable<Favorite[]> {
    return this.getUserFavorites(usuarioId).pipe(
      catchError((err: any) => {
        console.warn('⚠️ getUserFavorites failed, returning empty array as fallback');
        console.warn('Error was:', err?.error?.message || err?.message);
        return throwError(() => ({
          isFallback: true,
          favorites: [],
          originalError: err?.error?.message || 'No se pudieron cargar los favoritos'
        }));
      })
    );
  }

  /**
   * Verificar si una noticia está en favoritos
   * GET /users/:usuarioId/favorites/:noticiaId/check
   */
  checkFavorite(usuarioId: number | string, noticiaId: number | string): Observable<FavoriteCheckResponse> {
    return this.http.get<any>(`${this.apiUrl}/users/${usuarioId}/favorites/${noticiaId}/check`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return { isFavorited: false };
      }),
      catchError((err) => {
        console.error('Error checking favorite:', err);
        return throwError(() => err?.error?.message || 'Error al verificar favorito');
      })
    );
  }

  /**
   * Obtener usuarios que favoritearon una noticia
   * GET /users/news/:noticiaId/favorited-by
   */
  getUsersWhoFavorited(noticiaId: number | string): Observable<Favorite[]> {
    return this.http.get<any>(`${this.apiUrl}/users/news/${noticiaId}/favorited-by`).pipe(
      map((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('Error fetching users who favorited:', err);
        return throwError(() => err?.error?.message || 'Error al cargar usuarios');
      })
    );
  }

  /**
   * Obtener conteo de favoritos de una noticia
   * GET /users/news/:noticiaId/favorites-count
   */
  getFavoriteCount(noticiaId: number | string): Observable<FavoriteCountResponse> {
    return this.http.get<any>(`${this.apiUrl}/users/news/${noticiaId}/favorites-count`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return { count: 0 };
      }),
      catchError((err) => {
        console.error('Error fetching favorite count:', err);
        return throwError(() => err?.error?.message || 'Error al obtener conteo');
      })
    );
  }
}
