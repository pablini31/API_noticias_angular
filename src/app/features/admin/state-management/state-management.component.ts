import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { State } from '../../../core/models/state.model';

@Component({
  standalone: true,
  selector: 'app-state-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-section">
      <div class="section-header">
        <h2>Gestión de Estados</h2>
        <button class="btn primary" (click)="toggleForm()">
          {{ showForm ? 'Cancelar' : 'Crear Estado' }}
        </button>
      </div>

      <!-- Formulario -->
      <form *ngIf="showForm" (ngSubmit)="saveState()" class="form-card">
        <h3>{{ editingId ? 'Editar Estado' : 'Nuevo Estado' }}</h3>

        <div class="form-group">
          <label for="nombre" class="required">Nombre</label>
          <input
            id="nombre"
            type="text"
            [(ngModel)]="formData.nombre"
            name="nombre"
            required
            placeholder="Ej: Borrador, Publicado, Archivado"
          />
          <div *ngIf="errors['nombre']" class="form-error">{{ errors['nombre'] }}</div>
        </div>

        <div class="form-group">
          <label for="abreviacion" class="required">Abreviación</label>
          <input
            id="abreviacion"
            type="text"
            [(ngModel)]="formData.abreviacion"
            name="abreviacion"
            required
            placeholder="Ej: BOR, PUB, ARH"
            maxlength="5"
          />
          <div *ngIf="errors['abreviacion']" class="form-error">{{ errors['abreviacion'] }}</div>
          <div class="form-hint">Máximo 5 caracteres</div>
        </div>

        <div class="form-group">
          <label for="activo">
            <input id="activo" type="checkbox" [(ngModel)]="formData.activo" name="activo" />
            Activo
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn primary">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" class="btn secondary" (click)="cancelEdit()">Cancelar</button>
        </div>
      </form>

      <!-- Tabla -->
      <div *ngIf="!showForm" class="table-container">
        <div *ngIf="loading" class="loading-state">Cargando estados...</div>

        <div *ngIf="states.length === 0 && !loading" class="empty-state">
          <p>No hay estados registrados.</p>
        </div>

        <table *ngIf="states.length > 0 && !loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Abreviación</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let state of states">
              <td>{{ state.id }}</td>
              <td>{{ state.nombre }}</td>
              <td><code>{{ state.abreviacion }}</code></td>
              <td>
                <span *ngIf="state.activo" class="badge success">Sí</span>
                <span *ngIf="!state.activo" class="badge disabled">No</span>
              </td>
              <td>
                <button class="btn small ghost" (click)="editState(state)">Editar</button>
                <button class="btn small danger" (click)="deleteState(+state.id)">Eliminar</button>
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
      input[type='number'] {
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
      input[type='number']:focus {
        outline: none;
        border-color: var(--color-accent-primary);
        box-shadow: 0 0 0 3px rgba(200, 76, 76, 0.1);
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

      code {
        background: var(--color-bg-hover);
        padding: 0.2rem 0.5rem;
        border-radius: var(--border-radius-sm);
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
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
export class StateManagementComponent implements OnInit {
  states: State[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  formData = {
    nombre: '',
    abreviacion: '',
    activo: true,
  };

  errors: Record<string, string> = {};

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.loadStates();
  }

  loadStates() {
    this.loading = true;
    this.stateService.getAll().subscribe({
      next: (data) => {
        this.states = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los estados';
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

  editState(state: State) {
    this.editingId = state.id as number;
    this.formData.nombre = state.nombre;
    this.formData.abreviacion = state.abreviacion;
    this.formData.activo = state.activo || true;
    this.showForm = true;
    this.errors = {};
  }

  cancelEdit() {
    this.editingId = null;
    this.resetForm();
    this.showForm = false;
  }

  saveState() {
    this.errors = {};

    if (!this.formData.nombre.trim()) {
      this.errors['nombre'] = 'El nombre es requerido';
    }
    if (!this.formData.abreviacion.trim()) {
      this.errors['abreviacion'] = 'La abreviación es requerida';
    }
    if (this.formData.abreviacion.length > 5) {
      this.errors['abreviacion'] = 'Máximo 5 caracteres';
    }

    if (Object.keys(this.errors).length > 0) return;

    if (this.editingId) {
      this.stateService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Estado actualizado correctamente';
          this.resetForm();
          this.loadStates();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al actualizar el estado';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    } else {
      this.stateService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Estado creado correctamente';
          this.resetForm();
          this.loadStates();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al crear el estado';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  deleteState(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este estado?')) {
      this.stateService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Estado eliminado correctamente';
          this.loadStates();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al eliminar el estado';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  resetForm() {
    this.formData.nombre = '';
    this.formData.abreviacion = '';
    this.formData.activo = true;
    this.editingId = null;
    this.errors = {};
  }
}
