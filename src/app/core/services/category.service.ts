import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category, ApiResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        console.log('Category API response:', res);
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('Category API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar categorías');
      })
    );
  }

  getById(id: number | string): Observable<Category> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Category API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar categoría');
      })
    );
  }

  create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Category API error:', err);
        return throwError(() => err?.error?.message || 'Error al crear categoría');
      })
    );
  }

  update(id: number | string, data: Partial<Category>): Observable<Category> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Category API error:', err);
        return throwError(() => err?.error?.message || 'Error al actualizar categoría');
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Category API error:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar categoría');
      })
    );
  }
}
