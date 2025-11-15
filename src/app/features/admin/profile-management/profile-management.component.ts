import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  standalone: true,
  selector: 'app-profile-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-section">
      <div class="section-header">
        <h2>Gestión de Perfiles</h2>
        <button class="btn primary" (click)="toggleForm()">
          {{ showForm ? 'Cancelar' : 'Crear Perfil' }}
        </button>
      </div>

      <!-- Formulario de creación/edición -->
      <form *ngIf="showForm" (ngSubmit)="saveProfile()" class="form-card">
        <h3>{{ editingId ? 'Editar Perfil' : 'Nuevo Perfil' }}</h3>

        <div class="form-group">
          <label for="name" class="required">Nombre del Perfil</label>
          <input
            id="name"
            type="text"
            [(ngModel)]="formData.nombre"
            name="nombre"
            required
            placeholder="Ej: Administrador, Editor, Autor"
          />
          <div *ngIf="errors['nombre']" class="form-error">{{ errors['nombre'] }}</div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn primary">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" class="btn secondary" (click)="cancelEdit()">Cancelar</button>
        </div>
      </form>

      <!-- Tabla de perfiles -->
      <div *ngIf="!showForm" class="table-container">
        <div *ngIf="loading" class="loading-state">Cargando perfiles...</div>

        <div *ngIf="profiles.length === 0 && !loading" class="empty-state">
          <p>No hay perfiles registrados.</p>
        </div>

        <table *ngIf="profiles.length > 0 && !loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let profile of profiles">
              <td>{{ profile.id }}</td>
              <td>{{ profile.nombre }}</td>
              <td>{{ profile.createdAt | date: 'dd/MM/yyyy' }}</td>
              <td>{{ profile.updatedAt | date: 'dd/MM/yyyy' }}</td>
              <td>
                <button class="btn small ghost" (click)="editProfile(profile)">Editar</button>
                <button class="btn small danger" (click)="deleteProfile(+profile.id)">Eliminar</button>
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

      input {
        width: 100%;
        padding: var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        background: var(--color-bg-input);
        color: var(--color-text-primary);
        font-size: 1rem;
        font-family: inherit;
      }

      input:focus {
        outline: none;
        border-color: var(--color-accent-primary);
        box-shadow: 0 0 0 3px rgba(200, 76, 76, 0.1);
      }

      .form-error {
        color: var(--color-error);
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
export class ProfileManagementComponent implements OnInit {
  profiles: Profile[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  formData = {
    nombre: '',
  };

  errors: Record<string, string> = {};

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.loading = true;
    this.profileService.getAll().subscribe({
      next: (data) => {
        this.profiles = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los perfiles';
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

  editProfile(profile: Profile) {
    this.editingId = profile.id as number;
    this.formData.nombre = profile.nombre;
    this.showForm = true;
    this.errors = {};
  }

  cancelEdit() {
    this.editingId = null;
    this.resetForm();
    this.showForm = false;
  }

  saveProfile() {
    this.errors = {};

    if (!this.formData.nombre.trim()) {
      this.errors['nombre'] = 'El nombre es requerido';
      return;
    }

    if (this.editingId) {
      this.profileService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Perfil actualizado correctamente';
          this.resetForm();
          this.loadProfiles();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al actualizar el perfil';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    } else {
      this.profileService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Perfil creado correctamente';
          this.resetForm();
          this.loadProfiles();
          this.showForm = false;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al crear el perfil';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  deleteProfile(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      this.profileService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Perfil eliminado correctamente';
          this.loadProfiles();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err || 'Error al eliminar el perfil';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
      });
    }
  }

  resetForm() {
    this.formData.nombre = '';
    this.editingId = null;
    this.errors = {};
  }
}
