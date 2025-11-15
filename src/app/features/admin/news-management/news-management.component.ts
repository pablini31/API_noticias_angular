import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { CategoryService } from '../../../core/services/category.service';
import { StateService } from '../../../core/services/state.service';
import { News } from '../../../interfaces/news.interface';
import { Category } from '../../../core/models/category.model';
import { State } from '../../../core/models/state.model';

@Component({
  standalone: true,
  selector: 'app-news-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="news-management-container">
      <div class="header">
        <h1>📰 Gestión de Noticias</h1>
        <p class="subtitle">Administra todas las noticias del sistema</p>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Buscar:</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="applyFilters()"
            placeholder="Buscar por título..."
            class="filter-input">
        </div>
        <div class="filter-group">
          <label>Categoría:</label>
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="filter-select">
            <option [ngValue]="null">Todas</option>
            <option *ngFor="let cat of categories" [ngValue]="cat.id">{{cat.nombre}}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Estado:</label>
          <select [(ngModel)]="selectedState" (change)="applyFilters()" class="filter-select">
            <option [ngValue]="null">Todos</option>
            <option *ngFor="let st of states" [ngValue]="st.id">{{st.nombre}}</option>
          </select>
        </div>
        <button (click)="clearFilters()" class="btn-clear">Limpiar Filtros</button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">Cargando noticias...</div>

      <!-- Error -->
      <div *ngIf="error" class="error-message">{{error}}</div>

      <!-- News Table -->
      <div *ngIf="!loading && !error" class="table-container">
        <table class="news-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Visitas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let news of filteredNews">
              <td>{{news.id}}</td>
              <td class="title-cell">{{news.titulo}}</td>
              <td>
                <span class="badge badge-category">{{news.categoria?.nombre || 'N/A'}}</span>
              </td>
              <td>
                <span class="badge badge-state">{{news.estado?.nombre || 'N/A'}}</span>
              </td>
              <td>{{news.usuario?.nombre || 'N/A'}}</td>
              <td>{{formatDate(news.fecha_publicacion)}}</td>
              <td>{{news.visitas || 0}}</td>
              <td class="actions-cell">
                <button (click)="editNews(news)" class="btn-edit" title="Editar">✏️</button>
                <button (click)="deleteNews(news)" class="btn-delete" title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="filteredNews.length === 0">
              <td colspan="8" class="no-data">No hay noticias para mostrar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>✏️ Editar Noticia</h2>
            <button (click)="closeModal()" class="btn-close">✕</button>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveNews()" class="edit-form">
            <div class="form-group">
              <label>Título *</label>
              <input type="text" formControlName="titulo" class="form-control">
              <small *ngIf="editForm.get('titulo')?.invalid && editForm.get('titulo')?.touched" class="error-text">
                Mínimo 2 caracteres
              </small>
            </div>

            <div class="form-group">
              <label>Contenido *</label>
              <textarea formControlName="descripcion" rows="8" class="form-control"></textarea>
              <small *ngIf="editForm.get('descripcion')?.invalid && editForm.get('descripcion')?.touched" class="error-text">
                Mínimo 10 caracteres
              </small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select formControlName="categoria_id" class="form-control">
                  <option [ngValue]="null">Seleccionar</option>
                  <option *ngFor="let cat of categories" [ngValue]="cat.id">{{cat.nombre}}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Estado *</label>
                <select formControlName="estado_id" class="form-control">
                  <option [ngValue]="null">Seleccionar</option>
                  <option *ngFor="let st of states" [ngValue]="st.id">{{st.nombre}}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Estado de Publicación</label>
              <select formControlName="estado_publicacion" class="form-control">
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>

            <div class="form-group">
              <label>Imagen (Base64 o URL)</label>
              <textarea formControlName="imagen" rows="3" class="form-control" placeholder="URL o base64..."></textarea>
            </div>

            <div class="form-actions">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancelar</button>
              <button type="submit" [disabled]="editForm.invalid || saving" class="btn btn-primary">
                {{saving ? 'Guardando...' : 'Guardar Cambios'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-management-container {
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
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #7f8c8d;
      margin: 0;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      align-items: flex-end;
      border: 1px solid #ecf0f1;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
      min-width: 220px;
      max-width: 400px;
    }

    .filter-group label {
      font-weight: 600;
      font-size: 0.95rem;
      color: #2c3e50;
    }

    .filter-input, .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #34495e;
      border-radius: 6px;
      font-size: 1rem;
      background: #f8f9fa;
      color: #1a1a1a;
      transition: all 0.3s ease;
      height: 44px;
      font-family: inherit;
    }

    .filter-input:focus, .filter-select:focus {
      outline: none;
      border-color: #3498db;
      background: white;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    .filter-input::placeholder {
      color: #7f8c8d;
    }

    .filter-select option {
      background: #f8f9fa;
      color: #1a1a1a;
      padding: 0.5rem;
    }

    .btn-clear {
      padding: 0.75rem 1.5rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      height: 44px;
      transition: all 0.3s ease;
    }

    .btn-clear:hover {
      background: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .error-message {
      padding: 1rem;
      background: #fee;
      color: #c33;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow-x: auto;
    }

    .news-table {
      width: 100%;
      border-collapse: collapse;
    }

    .news-table thead {
      background: #34495e;
      color: white;
    }

    .news-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .news-table td {
      padding: 1rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .news-table tbody tr:hover {
      background: #f8f9fa;
    }

    .title-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-category {
      background: #3498db;
      color: white;
    }

    .badge-state {
      background: #2ecc71;
      color: white;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: transform 0.2s;
    }

    .btn-edit {
      background: #f39c12;
    }

    .btn-edit:hover {
      transform: scale(1.1);
    }

    .btn-delete {
      background: #e74c3c;
    }

    .btn-delete:hover {
      transform: scale(1.1);
    }

    .no-data {
      text-align: center;
      color: #7f8c8d;
      padding: 3rem !important;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #2c3e50;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #7f8c8d;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .btn-close:hover {
      color: #2c3e50;
    }

    .edit-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .error-text {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-primary:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }
  `]
})
export class NewsManagementComponent implements OnInit {
  private newsService = inject(NewsService);
  private categoryService = inject(CategoryService);
  private stateService = inject(StateService);
  private fb = inject(FormBuilder);

  allNews: News[] = [];
  filteredNews: News[] = [];
  categories: Category[] = [];
  states: State[] = [];

  searchTerm: string = '';
  selectedCategory: number | null = null;
  selectedState: number | null = null;

  loading = false;
  error: string | null = null;
  
  showEditModal = false;
  editForm!: FormGroup;
  currentNewsId: number | string | null = null;
  saving = false;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.editForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria_id: [null, Validators.required],
      estado_id: [null, Validators.required],
      estado_publicacion: ['publicado'],
      imagen: ['']
    });
  }

  async loadData() {
    this.loading = true;
    this.error = null;

    try {
      const [news, categories, states] = await Promise.all([
        this.newsService.getAll().toPromise(),
        this.categoryService.getAll().toPromise(),
        this.stateService.getAll().toPromise()
      ]);

      this.allNews = news || [];
      this.filteredNews = this.allNews;
      this.categories = categories || [];
      this.states = states || [];
    } catch (err: any) {
      this.error = err?.message || 'Error al cargar los datos';
      console.error('Error loading data:', err);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.filteredNews = this.allNews.filter(news => {
      const matchesSearch = !this.searchTerm || 
        news.titulo.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || 
        news.categoria_id === this.selectedCategory;
      const matchesState = !this.selectedState || 
        news.estado_id === this.selectedState;

      return matchesSearch && matchesCategory && matchesState;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedState = null;
    this.applyFilters();
  }

  editNews(news: News) {
    this.currentNewsId = news.id!;
    this.editForm.patchValue({
      titulo: news.titulo,
      descripcion: news.descripcion,
      categoria_id: news.categoria_id,
      estado_id: news.estado_id,
      estado_publicacion: news.estado_publicacion || 'publicado',
      imagen: news.imagen || ''
    });
    this.showEditModal = true;
  }

  async saveNews() {
    if (this.editForm.invalid || !this.currentNewsId) return;

    this.saving = true;
    try {
      const updateData = {
        ...this.editForm.value,
        fecha_publicacion: new Date().toISOString()
      };

      await this.newsService.update(this.currentNewsId, updateData).toPromise();
      alert('Noticia actualizada correctamente');
      this.closeModal();
      await this.loadData();
    } catch (err: any) {
      alert('Error al actualizar: ' + (err?.error?.message || err?.message || 'Error desconocido'));
      console.error('Error updating news:', err);
    } finally {
      this.saving = false;
    }
  }

  async deleteNews(news: News) {
    if (!confirm(`¿Eliminar la noticia "${news.titulo}"?`)) return;

    try {
      await this.newsService.delete(news.id!).toPromise();
      alert('Noticia eliminada correctamente');
      await this.loadData();
    } catch (err: any) {
      alert('Error al eliminar: ' + (err?.error?.message || err?.message || 'Error desconocido'));
      console.error('Error deleting news:', err);
    }
  }

  closeModal() {
    this.showEditModal = false;
    this.currentNewsId = null;
    this.editForm.reset();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
