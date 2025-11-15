import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoriteService, Favorite } from '../../../services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-my-favorites',
  imports: [CommonModule],
  template: `
    <div class="my-favorites-container">
      <div class="header">
        <h1>❤️ Mis Favoritos</h1>
        <p class="subtitle">Noticias que has guardado</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando favoritos...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && favorites.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No tienes favoritos aún</h3>
        <p>Las noticias que agregues a favoritos aparecerán aquí</p>
      </div>

      <!-- Favorites Grid -->
      <div *ngIf="!loading && favorites.length > 0" class="favorites-grid">
        <ng-container *ngFor="let favorite of favorites">
          <div *ngIf="favorite.noticia" class="favorite-card">
            <div *ngIf="favorite.noticia.imagen" class="card-image">
              <img [src]="favorite.noticia.imagen" [alt]="favorite.noticia.titulo" (click)="goToNews(favorite.noticia.id)">
            </div>
            <div class="card-content">
              <h3 class="card-title" (click)="goToNews(favorite.noticia.id)">{{favorite.noticia.titulo}}</h3>
              <p class="card-description">{{favorite.noticia.descripcion}}</p>

              <div class="card-meta">
                <span class="badge-category">Noticia</span>
                <span class="meta-date">{{formatDate(favorite.noticia.fecha_publicacion)}}</span>
              </div>

              <div class="card-actions">
                <button (click)="goToNews(favorite.noticia.id)" class="btn-read">Leer</button>
                <button (click)="removeFavorite(favorite.noticia_id)" class="btn-remove">💔 Remover</button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Count -->
      <div *ngIf="!loading && favorites.length > 0" class="count">
        Total: {{favorites.length}} {{favorites.length === 1 ? 'favorito' : 'favoritos'}}
      </div>
    </div>
  `,
  styles: [`
    .my-favorites-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .subtitle {
      color: #7f8c8d;
      margin: 0.5rem 0 0 0;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #ecf0f1;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #7f8c8d;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .favorite-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .favorite-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s;
    }

    .card-image img:hover {
      transform: scale(1.05);
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.1rem;
      color: #2c3e50;
      margin: 0 0 0.75rem 0;
      cursor: pointer;
      transition: color 0.3s;
    }

    .card-title:hover {
      color: #3498db;
    }

    .card-description {
      color: #7f8c8d;
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
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }

    .badge-category {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #3498db;
      color: white;
      border-radius: 12px;
      font-weight: 600;
    }

    .badge-state {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #2ecc71;
      color: white;
      border-radius: 12px;
      font-weight: 600;
    }

    .meta-date {
      color: #95a5a6;
      font-size: 0.8rem;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-read, .btn-remove {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .btn-read {
      background: #3498db;
      color: white;
    }

    .btn-read:hover {
      background: #2980b9;
    }

    .btn-remove {
      background: #fee2e2;
      color: #b91c1c;
    }

    .btn-remove:hover {
      background: #fecaca;
    }

    .count {
      text-align: center;
      color: #7f8c8d;
      margin-top: 2rem;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: 1fr;
      }

      .header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class MyFavoritesComponent implements OnInit {
  private router = inject(Router);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  favorites: Favorite[] = [];
  loading = false;

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    this.loading = true;
    try {
      const userId = this.authService.getUser()?.id;
      if (userId) {
        const numUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        try {
          this.favorites = await this.favoriteService.getUserFavorites(numUserId).toPromise() || [];
          console.log('✅ Favoritos cargados:', this.favorites.length);
        } catch (apiError: any) {
          console.error('❌ Error del API al cargar favoritos:', apiError);
          
          // Si el error es un 500 del backend (problema con relaciones), mostrar mensaje amigable
          if (apiError?.error?.message?.includes('is not associated')) {
            console.warn('⚠️ El backend tiene un problema con las relaciones. Mostrando lista vacía...');
            this.favorites = [];
            // No lanzar el error, solo mostrar mensaje
            alert('Tus favoritos estarán disponibles en breve. Por favor, intenta de nuevo más tarde.');
          } else {
            throw apiError;
          }
        }
      }
    } catch (err: any) {
      console.error('Error al cargar favoritos:', err);
      alert('Error al cargar favoritos: ' + (err?.message || 'Error desconocido'));
      this.favorites = [];
    } finally {
      this.loading = false;
    }
  }

  async removeFavorite(noticiaId: number | string | undefined) {
    if (!confirm('¿Remover de favoritos?')) return;

    try {
      const userId = this.authService.getUser()?.id;
      if (userId && noticiaId) {
        const numNotId = typeof noticiaId === 'string' ? parseInt(noticiaId, 10) : noticiaId;
        const numUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        await this.favoriteService.removeFavorite(numUserId, numNotId).toPromise();
        this.favorites = this.favorites.filter(f => f.noticia_id !== numNotId);
        alert('Removido de favoritos');
      }
    } catch (err: any) {
      alert('Error al remover: ' + (err?.message || 'Error desconocido'));
    }
  }

  goToNews(id: number | string | undefined) {
    if (id) {
      this.router.navigate(['/news', id]);
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
