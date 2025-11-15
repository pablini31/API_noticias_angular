import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../services/news.service';
import { CommentService } from '../../services/comment.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { News } from '../../interfaces/news.interface';
import type { Comment } from '../../services/comment.service';



@Component({
  standalone: true,
  selector: 'app-news-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="news-detail-container">
      <div *ngIf="loading" class="loading">Cargando noticia...</div>

      <div *ngIf="!loading && news" class="news-content">
        <!-- Header -->
        <header class="news-header">
          <button (click)="goBack()" class="btn-back">← Volver</button>
          <span class="badge">{{news.categoria?.nombre || 'Sin categoría'}}</span>
          <span class="badge-state">{{news.estado?.nombre || 'N/A'}}</span>
        </header>

        <!-- Title -->
        <h1 class="news-title">{{news.titulo}}</h1>

        <!-- Meta -->
        <div class="news-meta">
          <span>Por: {{news.usuario?.nombre || 'Anónimo'}}</span>
          <span>•</span>
          <span>{{formatDate(news.fecha_publicacion)}}</span>
          <span>•</span>
          <span>{{news.visitas || 0}} vistas</span>
        </div>

        <!-- Image -->
        <div *ngIf="news.imagen" class="news-image">
          <img [src]="news.imagen" [alt]="news.titulo">
        </div>

        <!-- Content -->
        <div class="news-body">
          <p>{{news.descripcion}}</p>
        </div>

        <!-- Favorite Button -->
        <div class="action-buttons">
          <button (click)="toggleFavorite()" class="btn-favorite" [class.active]="isFavorite">
            {{isFavorite ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}}
          </button>
        </div>

        <hr class="divider">

        <!-- Comments Section -->
        <section class="comments-section">
          <h2>💬 Comentarios ({{comments.length}})</h2>

          <!-- Comment Form (for authenticated users) -->
          <div *ngIf="isAuthenticated" class="comment-form-card">
            <h3>Escribe un comentario</h3>
            <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
              <textarea 
                formControlName="contenido" 
                placeholder="Comparte tu opinión..."
                rows="4"
                class="comment-textarea"></textarea>
              <small *ngIf="commentForm.get('contenido')?.invalid && commentForm.get('contenido')?.touched" class="error">
                Mínimo 1 carácter, máximo 2000
              </small>
              <div class="form-actions">
                <button type="submit" [disabled]="commentForm.invalid || submittingComment" class="btn-submit">
                  {{submittingComment ? 'Enviando...' : 'Enviar Comentario'}}
                </button>
              </div>
            </form>
          </div>

          <div *ngIf="!isAuthenticated" class="auth-prompt">
            <p>Debes <a routerLink="/auth/login">iniciar sesión</a> para comentar</p>
          </div>

          <!-- Comments List -->
          <div *ngIf="loadingComments" class="loading-small">Cargando comentarios...</div>

          <div *ngIf="!loadingComments && comments.length === 0" class="no-comments">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>

          <div *ngIf="!loadingComments" class="comments-list">
            <div *ngFor="let comment of comments" class="comment-card">
              <div class="comment-header">
                <div class="comment-author">
                  <strong>{{comment.usuario?.nombre || 'Usuario'}} {{comment.usuario?.apellidos || ''}}</strong>
                  <span *ngIf="!comment.aprobado" class="badge-pending">Pendiente de aprobación</span>
                </div>
                <span class="comment-date">{{formatDate(comment.createdAt)}}</span>
              </div>
              <p class="comment-content">{{comment.contenido}}</p>
              <div *ngIf="canDeleteComment(comment)" class="comment-actions">
                <button (click)="deleteComment(comment.id)" class="btn-delete-comment">🗑️ Eliminar</button>
              </div>
            </div>
          </div>

          <!-- Admin: Pending Comments -->
          <div *ngIf="isAdmin && pendingComments.length > 0" class="pending-section">
            <h3>⏳ Comentarios Pendientes de Aprobación</h3>
            <div *ngFor="let comment of pendingComments" class="comment-card pending">
              <div class="comment-header">
                <strong>{{comment.usuario?.nombre || 'Usuario'}}</strong>
                <span class="comment-date">{{formatDate(comment.createdAt)}}</span>
              </div>
              <p class="comment-content">{{comment.contenido}}</p>
              <div class="comment-actions">
                <button (click)="approveComment(comment.id)" class="btn-approve">✓ Aprobar</button>
                <button (click)="deleteComment(comment.id)" class="btn-delete-comment">✕ Rechazar</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .news-detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .loading, .loading-small {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }

    .news-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .btn-back {
      padding: 0.5rem 1rem;
      background: #ecf0f1;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #bdc3c7;
    }

    .badge, .badge-state {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge {
      background: #3498db;
      color: white;
    }

    .badge-state {
      background: #2ecc71;
      color: white;
    }

    .news-title {
      font-size: 2.5rem;
      color: #2c3e50;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .news-meta {
      display: flex;
      gap: 0.5rem;
      color: #7f8c8d;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .news-image {
      margin: 2rem 0;
      border-radius: 8px;
      overflow: hidden;
    }

    .news-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .news-body {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #34495e;
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .btn-favorite {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e74c3c;
      background: white;
      color: #e74c3c;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-favorite:hover {
      background: #e74c3c;
      color: white;
    }

    .btn-favorite.active {
      background: #e74c3c;
      color: white;
    }

    .divider {
      border: none;
      border-top: 2px solid #ecf0f1;
      margin: 3rem 0;
    }

    .comments-section h2 {
      font-size: 1.75rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .comment-form-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .comment-form-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: #2c3e50;
    }

    .comment-textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.95rem;
      resize: vertical;
    }

    .comment-textarea:focus {
      outline: none;
      border-color: #3498db;
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      display: block;
      margin-top: 0.5rem;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .btn-submit {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-submit:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .auth-prompt {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .auth-prompt a {
      color: #3498db;
      font-weight: 600;
      text-decoration: none;
    }

    .auth-prompt a:hover {
      text-decoration: underline;
    }

    .no-comments {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comment-card {
      background: white;
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .comment-card.pending {
      border-left: 4px solid #f39c12;
      background: #fef9e7;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .comment-author {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge-pending {
      padding: 0.25rem 0.5rem;
      background: #f39c12;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .comment-date {
      font-size: 0.875rem;
      color: #7f8c8d;
    }

    .comment-content {
      color: #2c3e50;
      line-height: 1.6;
      margin: 0;
    }

    .comment-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-delete-comment, .btn-approve {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-delete-comment {
      background: #fee2e2;
      color: #b91c1c;
    }

    .btn-delete-comment:hover {
      background: #fecaca;
    }

    .btn-approve {
      background: #d1fae5;
      color: #065f46;
    }

    .btn-approve:hover {
      background: #a7f3d0;
    }

    .pending-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #f39c12;
    }

    .pending-section h3 {
      font-size: 1.25rem;
      color: #f39c12;
      margin-bottom: 1rem;
    }
  `]
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);
  private commentService = inject(CommentService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  news: News | null = null;
  comments: Comment[] = [];
  pendingComments: Comment[] = [];
  commentForm!: FormGroup;

  loading = false;
  loadingComments = false;
  submittingComment = false;
  isFavorite = false;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.perfil_id === 1;
  }

  ngOnInit() {
    this.initCommentForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNews(id);
      this.loadComments(id);
    }
  }

  initCommentForm() {
    this.commentForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]]
    });
  }

  async loadNews(id: string) {
    this.loading = true;
    try {
      this.news = (await this.newsService.getById(id).toPromise()) || null;
      // Check if favorited
      const userId = this.authService.getUser()?.id;
      if (userId && this.news?.id) {
        const response = await this.favoriteService.checkFavorite(userId, this.news.id).toPromise();
        this.isFavorite = response?.isFavorited || false;
      }
    } catch (err) {
      alert('Error al cargar la noticia');
      this.router.navigate(['/']);
    } finally {
      this.loading = false;
    }
  }

  async loadComments(newsId: string) {
    this.loadingComments = true;
    try {
      const allComments = await this.commentService.getCommentsByNews(newsId).toPromise();
      if (allComments) {
        this.comments = allComments.filter(c => c.aprobado);
        if (this.isAdmin) {
          this.pendingComments = allComments.filter(c => !c.aprobado);
        }
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      this.loadingComments = false;
    }
  }

  async submitComment() {
    if (this.commentForm.invalid || !this.news?.id) return;

    this.submittingComment = true;
    try {
      const data = this.commentForm.value;
      await this.commentService.createComment(this.news.id, data).toPromise();
      alert('Comentario enviado. Pendiente de aprobación.');
      this.commentForm.reset();
      await this.loadComments(this.news.id.toString());
    } catch (err: any) {
      alert('Error al enviar comentario: ' + (err?.message || 'Error desconocido'));
    } finally {
      this.submittingComment = false;
    }
  }

  async deleteComment(commentId: number) {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      if (this.news?.id) {
        await this.commentService.deleteComment(this.news.id, commentId).toPromise();
        alert('Comentario eliminado');
        await this.loadComments(this.news.id.toString());
      }
    } catch (err: any) {
      alert('Error al eliminar comentario: ' + (err?.message || 'Error desconocido'));
    }
  }

  async approveComment(commentId: number) {
    try {
      await this.commentService.approveComment(commentId).toPromise();
      alert('Comentario aprobado');
      if (this.news?.id) {
        await this.loadComments(this.news.id.toString());
      }
    } catch (err: any) {
      alert('Error al aprobar comentario: ' + (err?.message || 'Error desconocido'));
    }
  }

  canDeleteComment(comment: Comment): boolean {
    const user = this.authService.getUser();
    return user?.perfil_id === 1 || user?.id === comment.usuario_id;
  }

  async toggleFavorite() {
    const userId = this.authService.getUser()?.id;
    if (!userId || !this.news?.id) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      if (this.isFavorite) {
        await this.favoriteService.removeFavorite(userId, this.news.id).toPromise();
        this.isFavorite = false;
        alert('Removido de favoritos');
      } else {
        await this.favoriteService.addFavorite(userId, this.news.id).toPromise();
        this.isFavorite = true;
        alert('Agregado a favoritos');
      }
    } catch (err: any) {
      alert('Error al actualizar favoritos: ' + (err?.message || 'Error desconocido'));
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
