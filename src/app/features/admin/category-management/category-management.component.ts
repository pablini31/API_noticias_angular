import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-category-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-section">
      <div class="section-header">
        <h2>Gestión de Categorías</h2>
        <button class="btn primary" (click)="toggleForm()">
          {{ showForm ? 'Cancelar' : 'Crear Categoría' }}
        </button>
      </div>

      <!-- Formulario -->
      <form *ngIf="showForm" (ngSubmit)="saveCategory()" class="form-card">
        <h3>{{ editingId ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>

        <div class="form-group">
          <label for="nombre" class="required">Nombre</label>
          <input
            id="nombre"
            type="text"
            [(ngModel)]="formData.nombre"
            name="nombre"
            required
            placeholder="Ej: Política, Tecnología, Deportes"
          />
          <div *ngIf="errors['nombre']" class="form-error">{{ errors['nombre'] }}</div>
          <div class="form-hint">Mínimo 5 caracteres, máximo 50</div>
        </div>

        <div class="form-group">
          <label for="descripcion" class="required">Descripción</label>
          <textarea
            id="descripcion"
            [(ngModel)]="formData.descripcion"
            name="descripcion"
            required
            placeholder="Describe brevemente el propósito de esta categoría"
          ></textarea>
          <div *ngIf="errors['descripcion']" class="form-error">{{ errors['descripcion'] }}</div>
          <div class="form-hint">Mínimo 5 caracteres, máximo 255</div>
        </div>

        <div class="form-group">
          <label for="activo">
            <input id="activo" type="checkbox" [(ngModel)]="formData.activo" name="activo" />
            Activa
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn primary">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" class="btn secondary" (click)="cancelEdit()">Cancelar</button>
        </div>
      </form>

      <!-- Tabla -->
      <div *ngIf="!showForm" class="table-container">
        <div *ngIf="loading" class="loading-state">Cargando categorías...</div>

        <div *ngIf="categories.length === 0 && !loading" class="empty-state">
          <p>No hay categorías registradas.</p>
        </div>

        <table *ngIf="categories.length > 0 && !loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Activa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories">
              <td>{{ category.id }}</td>
              <td><strong>{{ category.nombre }}</strong></td>
              <td>{{ category.descripcion }}</td>
              <td>
                <span *ngIf="category.activo" class="badge success">Sí</span>
                <span *ngIf="!category.activo" class="badge disabled">No</span>
              </td>
              <td>
                <button class="btn small ghost" (click)="editCategory(category)">Editar</button>
                <button class="btn small danger" (click)="deleteCategory(+category.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="successMessage" class="alert success">
        <span class="alert-icon">✓</span>
        <div class="alert-message">{{ successMessage }}</div>
      </div>

      <div *ngIf="errorMessage" class="alert error">
        <span class="alert-icon">✕</span>
        <div class="alert-message">{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .management-section {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-lg);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-md);
        border-bottom: 2px solid var(--color-accent-primary);
      }

      .section-header h2 {
        margin: 0;
      }

      .form-card {
        background: var(--color-bg-hover);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        margin-bottom: var(--spacing-lg);
        border-left: 4px solid var(--color-accent-primary);
      }

      .form-card h3 {
        margin-top: 0;
        margin-bottom: var(--spacing-lg);
        color: var(--color-accent-primary);
      }

      .form-group {
        margin-bottom: var(--spacing-lg);
      }

      label {
        display: block;
        margin-bottom: var(--spacing-sm);
        font-weight: 600;
        color: var(--color-text-primary);
      }

      label.required::after {
        content: ' *';
        color: var(--color-error);
      }

      label input[type='checkbox'] {
        margin-right: var(--spacing-sm);
      }

      input[type='text'],
      textarea {
        width: 100%;
        padding: var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        background: var(--color-bg-input);
        color: var(--color-text-primary);
        font-size: 1rem;
        font-family: inherit;
      }

      input[type='text']:focus,
      textarea:focus {
        outline: none;
        border-color: var(--color-accent-primary);
        box-shadow: 0 0 0 3px rgba(200, 76, 76, 0.1);
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }

      .form-error {
        color: var(--color-error);
        font-size: 0.85rem;
        margin-top: var(--spacing-xs);
      }

      .form-hint {
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        margin-top: var(--spacing-xs);
      }

      .form-actions {
        display: flex;
        gap: var(--spacing-md);
      }

      .table-container {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: var(--spacing-lg);
      }

      th {
        background: var(--color-bg-hover);
        padding: var(--spacing-md);
        text-align: left;
        font-weight: 600;
        color: var(--color-text-primary);
        border-bottom: 2px solid var(--color-border);
      }

      td {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-primary);
      }

      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.85rem;
        font-weight: 600;
      }

      .badge.success {
        background: var(--color-success-bg);
        color: #166534;
      }

      .badge.disabled {
        background: var(--color-bg-hover);
        color: var(--color-text-secondary);
      }

      tbody tr:hover {
        background: var(--color-bg-hover);
      }

      .loading-state,
      .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--color-text-secondary);
      }
    `,
  ],
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  formData = {
    nombre: '',
    descripcion: '',
    activo: true,
  };

  errors: Record<string, string> = {};

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar las categorías';
        this.loading = false;
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  editCategory(category: Category) {
    this.editingId = category.id as number;
    this.formData.nombre = category.nombre;
    this.formData.descripcion = category.descripcion;
    this.formData.activo = category.activo || true;
    this.showForm = true;
    this.errors = {};
  }

  cancelEdit() {
    this.editingId = null;
    this.resetForm();
    this.showForm = false;
  }

  saveCategory() {
    this.errors = {};

    if (!this.formData.nombre.trim() || this.formData.nombre.length < 5) {
      this.errors['nombre'] = 'El nombre debe tener al menos 5 caracteres';
    }
    if (this.formData.nombre.length > 50) {
      this.errors['nombre'] = 'El nombre no puede exceder 50 caracteres';
    }

    if (!this.formData.descripcion.trim() || this.formData.descripcion.length < 5) {
      this.errors['descripcion'] = 'La descripción debe tener al menos 5 caracteres';
    }
    if (this.formData.descripcion.length > 255) {
      this.errors['descripcion'] = 'La descripción no puede exceder 255 caracteres';
    }

    if (Object.keys(this.errors).length > 0) return;

    if (this.editingId) {
      this.categoryService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Categoría actualizada correctamente';
          this.resetForm();
          this.loadCategories();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al actualizar la categoría';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    } else {
      this.categoryService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Categoría creada correctamente';
          this.resetForm();
          this.loadCategories();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al crear la categoría';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Categoría eliminada correctamente';
          this.loadCategories();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al eliminar la categoría';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  resetForm() {
    this.formData.nombre = '';
    this.formData.descripcion = '';
    this.formData.activo = true;
    this.editingId = null;
    this.errors = {};
  }
}
