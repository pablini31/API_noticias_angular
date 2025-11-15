import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.component';
import { News } from '../../../interfaces/news.interface';

@Component({
  standalone: true,
  selector: 'app-my-news',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-news">
      <div class="header-section">
        <h2>Mis Noticias</h2>
        <p class="count">Total: {{ news.length }} artículos</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando tus noticias...</p>
      </div>

      <div *ngIf="!loading && news.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Sin noticias aún</h3>
        <p>No has creado ningún artículo. ¡Crea uno ahora!</p>
      </div>

      <div *ngIf="!loading && news.length > 0" class="news-grid">
        <div *ngFor="let item of news" class="news-card">
          <div class="card-header">
            <h3>{{ item.titulo }}</h3>
            <div class="card-badge" [ngClass]="'badge-' + item.estado_id">
              {{ getStateLabel(item.estado_id) }}
            </div>
          </div>

          <p class="card-description">{{ item.descripcion }}</p>

          <div class="card-meta">
            <span class="meta-item">
              <strong>Categoría:</strong> {{ getCategoryLabel(item.categoria_id) }}
            </span>
            <span class="meta-item">
              <strong>Fecha:</strong> {{ item.createdAt | date: 'dd/MM/yyyy' }}
            </span>
          </div>

          <div class="card-actions">
            <button class="btn secondary small" [routerLink]="['/dashboard/edit', item.id]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            <button class="btn danger small" (click)="deleteNews(item.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .my-news {
        width: 100%;
      }

      .header-section {
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 1rem;
      }

      .header-section h2 {
        font-size: 1.75rem;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        font-weight: 400;
      }

      .count {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.9rem;
      }

      .loading,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-light);
        border-top: 3px solid var(--accent-light);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        font-size: 1.25rem;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .empty-state p {
        color: var(--text-secondary);
        margin: 0;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .news-card {
        border: 1px solid var(--border-light);
        border-radius: 8px;
        border-left: 4px solid var(--accent-light);
        padding: 1.5rem;
        background: var(--card-bg);
        transition: all 0.3s ease;
      }

      .news-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .card-header h3 {
        font-size: 1.1rem;
        color: var(--text-primary);
        margin: 0;
        flex: 1;
        line-height: 1.3;
      }

      .card-badge {
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .badge-1 {
        background: #dcfce7;
        color: #166534;
      }

      .badge-2 {
        background: #dbeafe;
        color: #1e40af;
      }

      .badge-3 {
        background: #fef3c7;
        color: #92400e;
      }

      html.dark .badge-1 {
        background: rgba(34, 197, 94, 0.2);
        color: #86efac;
      }

      html.dark .badge-2 {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
      }

      html.dark .badge-3 {
        background: rgba(234, 179, 8, 0.2);
        color: #fde047;
      }

      .card-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 1rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
      }

      .meta-item {
        display: block;
      }

      .card-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-light);
      }

      .btn-secondary:hover {
        background: var(--accent-light);
        color: white;
      }

      .btn-danger {
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }

      .btn-danger:hover {
        background: #fecaca;
      }

      html.dark .btn-secondary {
        background: var(--card-bg);
        border-color: var(--border-dark);
      }

      html.dark .btn-secondary:hover {
        background: var(--accent-dark);
      }

      html.dark .btn-danger {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        border-color: var(--error-border);
      }

      html.dark .btn-danger:hover {
        background: rgba(239, 68, 68, 0.3);
      }

      html.dark .news-card {
        border-left-color: var(--accent-dark);
      }

      html.dark .news-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      @media (max-width: 768px) {
        .news-grid {
          grid-template-columns: 1fr;
        }

        .card-header {
          flex-direction: column;
        }

        .card-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class MyNewsComponent implements OnInit {
  news: News[] = [];
  loading = true;

  constructor(
    private newsService: NewsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.newsService.getAll().subscribe({
      next: (data: News[]) => {
        const userId = this.authService.getUser()?.id;
        this.news = data.filter((n) => n.usuario_id === userId);
        this.loading = false;
      },
      error: () => {
        ToastService.error('Error al cargar tus noticias');
        this.loading = false;
      },
    });
  }

  deleteNews(id: string | number | undefined): void {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      return;
    }

    this.newsService.delete(Number(id)).subscribe({
      next: () => {
        ToastService.success('Noticia eliminada correctamente');
        this.loadNews();
      },
      error: () => {
        ToastService.error('Error al eliminar la noticia');
      },
    });
  }

  getStateLabel(stateId: number): string {
    const labels: { [key: number]: string } = {
      1: 'Borrador',
      2: 'Publicado',
      3: 'Archivado',
    };
    return labels[stateId] || 'Desconocido';
  }

  getCategoryLabel(categoryId: number): string {
    // Este método podría extenderse para cargar desde el servicio
    // Por ahora, retorna el ID
    return `Categoría ${categoryId}`;
  }
}
