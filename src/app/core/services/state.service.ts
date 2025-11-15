import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { State } from '../models/state.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  private apiUrl = '/api/states';

  constructor(private http: HttpClient) {}

  getAll(): Observable<State[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        console.log('State API response:', res);
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('State API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar estados');
      })
    );
  }

  getById(id: number | string): Observable<State> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('State API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar estado');
      })
    );
  }

  create(data: Omit<State, 'id' | 'createdAt' | 'updatedAt'>): Observable<State> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('State API error:', err);
        return throwError(() => err?.error?.message || 'Error al crear estado');
      })
    );
  }

  update(id: number | string, data: Partial<State>): Observable<State> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('State API error:', err);
        return throwError(() => err?.error?.message || 'Error al actualizar estado');
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('State API error:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar estado');
      })
    );
  }
}
