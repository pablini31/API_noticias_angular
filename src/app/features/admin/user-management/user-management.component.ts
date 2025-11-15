import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/components/toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-user-management',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="management-panel">
      <div class="panel-header">
        <h2>Gestión de Usuarios</h2>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? '✕ Cancelar' : '+ Nuevo Usuario' }}
        </button>
      </div>

      <!-- Formulario de creación -->
      <div *ngIf="showForm" class="form-section">
        <h3>Crear Nuevo Usuario</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="management-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                placeholder="Nombre del usuario"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="apellidos">Apellidos</label>
              <input
                id="apellidos"
                type="text"
                formControlName="apellidos"
                placeholder="Apellidos"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="nick">Nick</label>
              <input
                id="nick"
                type="text"
                formControlName="nick"
                placeholder="Nombre de usuario único"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="correo">Correo Electrónico</label>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                placeholder="correo@example.com"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Contraseña segura"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="perfil">Perfil</label>
              <select formControlName="perfil_id" id="perfil" class="form-control">
                <option value="">Selecciona un perfil</option>
                <option value="1">Administrador</option>
                <option value="2">Contribuidor</option>
                <option value="3">Lector</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loading || !form.valid">
            {{ loading ? '⏳ Creando...' : '✓ Crear Usuario' }}
          </button>
        </form>
      </div>

      <!-- Lista de usuarios -->
      <div class="list-section">
        <h3>Usuarios del Sistema</h3>
        <div *ngIf="loadingList" class="loading">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>

        <div *ngIf="!loadingList && users.length === 0" class="empty-state">
          <p>No hay usuarios en el sistema</p>
        </div>

        <div *ngIf="!loadingList && users.length > 0" class="users-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nick</th>
                <th>Correo</th>
                <th>Perfil</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.nombre }} {{ user.apellidos }}</td>
                <td>{{ user.nick }}</td>
                <td>{{ user.correo }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + user.perfil_id">
                    {{ getProfileLabel(user.perfil_id) }}
                  </span>
                </td>
                <td>
                  <span class="status" [ngClass]="user.activo ? 'active' : 'inactive'">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button class="btn-sm btn-secondary" (click)="editUser(user)">Editar</button>
                  <button class="btn-sm btn-danger" (click)="deleteUser(user.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .management-panel {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-light);
      }

      .panel-header h2 {
        font-size: 1.5rem;
        margin: 0;
        color: var(--text-primary);
      }

      .form-section {
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
      }

      .form-section h3 {
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
        color: var(--text-primary);
      }

      .management-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      .form-control {
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--accent-light);
        box-shadow: 0 0 0 3px rgba(200, 76, 76, 0.1);
      }

      .list-section {
        background: transparent;
      }

      .list-section h3 {
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 0.75rem;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-light);
        border-top: 3px solid var(--accent-light);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
      }

      .users-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        overflow: hidden;
      }

      thead {
        background: var(--bg-secondary);
        border-bottom: 2px solid var(--border-light);
      }

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid var(--border-light);
        color: var(--text-primary);
      }

      tbody tr:hover {
        background: var(--bg-secondary);
      }

      .badge {
        display: inline-block;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .badge-1 {
        background: #dbeafe;
        color: #1e40af;
      }

      .badge-2 {
        background: #fef3c7;
        color: #92400e;
      }

      .badge-3 {
        background: #dcfce7;
        color: #166534;
      }

      .status {
        display: inline-block;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .status.active {
        background: #dcfce7;
        color: #166534;
      }

      .status.inactive {
        background: #fee2e2;
        color: #b91c1c;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: var(--accent-light);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--accent-hover);
      }

      .btn-sm {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
        border: 1px solid;
      }

      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border-color: var(--border-light);
      }

      .btn-secondary:hover {
        background: var(--accent-light);
        color: white;
      }

      .btn-danger {
        background: #fee2e2;
        color: #b91c1c;
        border-color: #fecaca;
      }

      .btn-danger:hover {
        background: #fecaca;
      }

      html.dark .form-section,
      html.dark table {
        background: var(--card-bg);
      }

      html.dark thead {
        background: var(--bg-secondary);
      }

      html.dark .badge-1 {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
      }

      html.dark .badge-2 {
        background: rgba(234, 179, 8, 0.2);
        color: #fde047;
      }

      html.dark .badge-3 {
        background: rgba(34, 197, 94, 0.2);
        color: #86efac;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        table {
          font-size: 0.8rem;
        }

        th,
        td {
          padding: 0.75rem 0.5rem;
        }

        .btn-sm {
          display: block;
          width: 100%;
          margin-bottom: 0.5rem;
        }
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  form!: FormGroup;
  showForm = false;
  loading = false;
  loadingList = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      nick: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      perfil_id: ['', Validators.required],
    });
  }

  private loadUsers(): void {
    this.loadingList = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loadingList = false;
      },
      error: () => {
        ToastService.error('Error al cargar usuarios');
        this.loadingList = false;
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.loading = true;
    const data = this.form.value;

    this.userService.create(data).subscribe({
      next: () => {
        ToastService.success('Usuario creado correctamente');
        this.form.reset();
        this.showForm = false;
        this.loadUsers();
        this.loading = false;
      },
      error: () => {
        ToastService.error('Error al crear usuario');
        this.loading = false;
      },
    });
  }

  editUser(user: any): void {
    ToastService.info('Edición de usuario en desarrollo');
  }

  deleteUser(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        ToastService.success('Usuario eliminado correctamente');
        this.loadUsers();
      },
      error: () => {
        ToastService.error('Error al eliminar usuario');
      },
    });
  }

  getProfileLabel(profileId: number): string {
    const labels: { [key: number]: string } = {
      1: 'Admin',
      2: 'Contribuidor',
      3: 'Lector',
    };
    return labels[profileId] || 'Desconocido';
  }
}
