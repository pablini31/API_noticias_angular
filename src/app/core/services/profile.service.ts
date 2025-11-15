import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = '/api/profiles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Profile[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        console.log('Profile API response:', res);
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('Profile API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar perfiles');
      })
    );
  }

  getById(id: number | string): Observable<Profile> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Profile API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar perfil');
      })
    );
  }

  create(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Observable<Profile> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Profile API error:', err);
        return throwError(() => err?.error?.message || 'Error al crear perfil');
      })
    );
  }

  update(id: number | string, data: Partial<Profile>): Observable<Profile> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Profile API error:', err);
        return throwError(() => err?.error?.message || 'Error al actualizar perfil');
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Profile API error:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar perfil');
      })
    );
  }
}
