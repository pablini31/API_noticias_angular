import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { News, CreateNewsRequest, UpdateNewsRequest } from '../interfaces/news.interface';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private base = '/api/news';

  constructor(private http: HttpClient) {}

  getAll(): Observable<News[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        console.log('News API response:', res);
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticias');
      })
    );
  }

  getById(id: number | string): Observable<News> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticia');
      })
    );
  }

  getByCategory(categoryId: number | string): Observable<News[]> {
    return this.http.get<any>(`${this.base}/category/${categoryId}`).pipe(
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
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticias');
      })
    );
  }

  getByState(stateId: number | string): Observable<News[]> {
    return this.http.get<any>(`${this.base}/state/${stateId}`).pipe(
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
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticias');
      })
    );
  }

  create(data: CreateNewsRequest): Observable<News> {
    return this.http.post<any>(this.base, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al crear noticia');
      })
    );
  }

  update(id: number | string, data: UpdateNewsRequest): Observable<News> {
    return this.http.put<any>(`${this.base}/${id}`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al actualizar noticia');
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError((err) => {
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar noticia');
      })
    );
  }

  getTrending(limit: number = 10): Observable<News[]> {
    return this.http.get<any>(`${this.base}/trending?limit=${limit}`).pipe(
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
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticias trending');
      })
    );
  }

  getLatest(limit: number = 10): Observable<News[]> {
    return this.http.get<any>(`${this.base}/latest?limit=${limit}`).pipe(
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
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar noticias recientes');
      })
    );
  }

  searchNews(query: string): Observable<News[]> {
    return this.http.get<any>(`${this.base}/search/${encodeURIComponent(query)}`).pipe(
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
        console.error('News API error:', err);
        return throwError(() => err?.error?.message || 'Error al buscar noticias');
      })
    );
  }
}
