import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Comment {
  id: number;
  noticia_id: number;
  usuario_id: number;
  contenido: string;
  aprobado: boolean;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  usuario?: {
    id: number;
    nombre: string;
    apellidos: string;
    nick: string;
    avatar?: string | null;
  };
  noticia?: {
    id: number;
    titulo: string;
  };
}

export interface CreateCommentRequest {
  contenido: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtener comentarios de una noticia específica
   * GET /news/:newsId/comments
   */
  getCommentsByNews(newsId: number | string): Observable<Comment[]> {
    return this.http.get<any>(`${this.apiUrl}/news/${newsId}/comments`).pipe(
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
        console.error('Error fetching comments:', err);
        return throwError(() => err?.error?.message || 'Error al cargar comentarios');
      })
    );
  }

  /**
   * Crear un nuevo comentario en una noticia
   * POST /news/:newsId/comments
   */
  createComment(newsId: number | string, data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<any>(`${this.apiUrl}/news/${newsId}/comments`, data).pipe(
      map((res) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      }),
      catchError((err) => {
        console.error('Error creating comment:', err);
        return throwError(() => err?.error?.message || 'Error al crear comentario');
      })
    );
  }

  /**
   * Eliminar un comentario
   * DELETE /news/:newsId/comments/:commentId
   */
  deleteComment(newsId: number | string, commentId: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/news/${newsId}/comments/${commentId}`).pipe(
      catchError((err) => {
        console.error('Error deleting comment:', err);
        return throwError(() => err?.error?.message || 'Error al eliminar comentario');
      })
    );
  }

  /**
   * Obtener comentarios pendientes de aprobación (solo Admin)
   * GET /news/comments/pending
   */
  getPendingComments(): Observable<{ comments: Comment[]; total: number }> {
    return this.http.get<any>(`${this.apiUrl}/news/comments/pending`).pipe(
      map((res) => {
        if (res && res.data) {
          return {
            comments: Array.isArray(res.data) ? res.data : [],
            total: res.total || 0
          };
        }
        return { comments: [], total: 0 };
      }),
      catchError((err) => {
        console.error('Error fetching pending comments:', err);
        return throwError(() => err?.error?.message || 'Error al cargar comentarios pendientes');
      })
    );
  }

  /**
   * Aprobar un comentario (solo Admin)
   * POST /news/comments/approve/:commentId
   */
  approveComment(commentId: number | string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/news/comments/approve/${commentId}`, {}).pipe(
      catchError((err) => {
        console.error('Error approving comment:', err);
        return throwError(() => err?.error?.message || 'Error al aprobar comentario');
      })
    );
  }
}
