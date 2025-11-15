import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserData, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserData[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        console.log('User API response:', res);
        if (res && res.data && Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      }),
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar usuarios');
      })
    );
  }

  getById(id: number | string): Observable<UserData> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al cargar usuario');
      })
    );
  }

  getByEmail(email: string): Observable<UserData> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al buscar usuario');
      })
    );
  }

  create(data: CreateUserRequest): Observable<UserData> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al crear usuario');
      })
    );
  }

  update(id: number | string, data: UpdateUserRequest): Observable<UserData> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al actualizar usuario');
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('User API error:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar usuario');
      })
    );
  }
}
