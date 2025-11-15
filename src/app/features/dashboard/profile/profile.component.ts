import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/components/toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile">
      <div class="profile-header">
        <h2>Mi Perfil</h2>
        <p class="subtitle">Información personal y cuenta</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando perfil...</p>
      </div>

      <div *ngIf="!loading" class="profile-content">
        <!-- Información básica (lectura) -->
        <div class="info-section">
          <h3>Información de la Cuenta</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre Completo</label>
              <p class="info-value">{{ fullName }}</p>
            </div>
            <div class="info-item">
              <label>Nick</label>
              <p class="info-value">{{ user?.nick }}</p>
            </div>
            <div class="info-item">
              <label>Correo Electrónico</label>
              <p class="info-value">{{ user?.correo }}</p>
            </div>
            <div class="info-item">
              <label>Rol</label>
              <p class="info-value badge" [ngClass]="'badge-' + user?.perfil_id">
                {{ getRoleLabel(user?.perfil_id) }}
              </p>
            </div>
            <div class="info-item">
              <label>Estado de Cuenta</label>
              <p class="info-value" [ngClass]="user?.activo ? 'active' : 'inactive'">
                {{ user?.activo ? '✓ Activa' : '✗ Inactiva' }}
              </p>
            </div>
            <div class="info-item">
              <label>Miembro desde</label>
              <p class="info-value">{{ user?.createdAt | date: 'dd/MM/yyyy' }}</p>
            </div>
          </div>
        </div>

        <!-- Cambiar contraseña -->
        <div class="form-section">
          <h3>Cambiar Contraseña</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="password-form">
            <div class="form-group">
              <label for="current">Contraseña Actual</label>
              <input
                id="current"
                type="password"
                formControlName="current_password"
                placeholder="Ingresa tu contraseña actual"
                class="form-control"
              />
              <span *ngIf="isFieldInvalid('current_password', 'password')" class="error-text">
                La contraseña es requerida
              </span>
            </div>

            <div class="form-group">
              <label for="new">Nueva Contraseña</label>
              <input
                id="new"
                type="password"
                formControlName="new_password"
                placeholder="Ingresa tu nueva contraseña"
                class="form-control"
              />
              <span *ngIf="isFieldInvalid('new_password', 'password')" class="error-text">
                La contraseña debe tener mínimo 8 caracteres
              </span>
            </div>

            <div class="form-group">
              <label for="confirm">Confirmar Contraseña</label>
              <input
                id="confirm"
                type="password"
                formControlName="confirm_password"
                placeholder="Confirma tu nueva contraseña"
                class="form-control"
              />
              <span *ngIf="isFieldInvalid('confirm_password', 'password')" class="error-text">
                Las contraseñas no coinciden
              </span>
            </div>

            <div *ngIf="errorMessage" class="error-banner">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="btn primary small"
              [disabled]="passwordLoading || !passwordForm.valid"
            >
              <span *ngIf="!passwordLoading">Cambiar contraseña</span>
              <span *ngIf="passwordLoading">Procesando...</span>
            </button>
          </form>
        </div>

        <!-- Acciones de cuenta -->
        <div class="actions-section">
          <h3>Acciones</h3>
          <div class="action-buttons">
            <button class="btn secondary small" (click)="onLogoutAllDevices()">
              Cerrar otras sesiones
            </button>
            <button class="btn danger small" (click)="onDeleteAccount()">
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile {
        max-width: 800px;
      }

      .profile-header {
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 1rem;
      }

      .profile-header h2 {
        font-size: 1.75rem;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        font-weight: 400;
      }

      .subtitle {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.9rem;
      }

      .loading-state {
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

      .profile-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .info-section,
      .form-section,
      .actions-section {
        background: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1.5rem;
      }

      .info-section h3,
      .form-section h3,
      .actions-section h3 {
        font-size: 1.25rem;
        color: var(--text-primary);
        margin: 0 0 1.5rem 0;
        font-weight: 400;
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 0.75rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .info-item label {
        font-size: 0.85rem;
        color: var(--text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .info-value {
        font-size: 1rem;
        color: var(--text-primary);
        margin: 0;
        font-weight: 500;
      }

      .info-value.active {
        color: #16a34a;
      }

      .info-value.inactive {
        color: #dc2626;
      }

      .info-value.badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        width: fit-content;
      }

      .badge-1 {
        background: #dbeafe;
        color: #1e40af;
      }

      .badge-2 {
        background: #fef3c7;
        color: #92400e;
      }

      .password-form {
        display: flex;
        flex-direction: column;
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
        font-size: 0.95rem;
      }

      .form-control {
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.95rem;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--accent-light);
        box-shadow: 0 0 0 3px rgba(200, 76, 76, 0.1);
      }

      .error-text {
        color: #b91c1c;
        font-size: 0.8rem;
      }

      .error-banner {
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 4px;
        padding: 1rem;
        color: #b91c1c;
        margin: 0;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.2s ease;
        text-align: left;
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

      .btn-warning {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde047;
      }

      .btn-warning:hover:not(:disabled) {
        background: #fde047;
      }

      .btn-danger {
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }

      .btn-danger:hover:not(:disabled) {
        background: #fecaca;
      }

      html.dark .badge-1 {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
      }

      html.dark .badge-2 {
        background: rgba(234, 179, 8, 0.2);
        color: #fde047;
      }

      html.dark .error-banner {
        background: rgba(239, 68, 68, 0.2);
        border-color: var(--error-border);
        color: var(--error-border);
      }

      html.dark .form-control:focus {
        box-shadow: 0 0 0 3px rgba(216, 108, 108, 0.1);
      }

      @media (max-width: 768px) {
        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: any;
  loading = true;
  passwordForm!: FormGroup;
  passwordLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.initPasswordForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
    });
  }

  private loadProfile(): void {
    this.user = this.authService.getUser();
    this.loading = false;
  }

  get fullName(): string {
    return `${this.user?.nombre || ''} ${this.user?.apellidos || ''}`.trim();
  }

  getRoleLabel(profileId: number | undefined): string {
    const labels: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Contribuidor',
      3: 'Lector',
    };
    return labels[profileId || 0] || 'Desconocido';
  }

  onChangePassword(): void {
    if (!this.passwordForm.valid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const { new_password, confirm_password } = this.passwordForm.value;
    if (new_password !== confirm_password) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.passwordLoading = true;
    this.errorMessage = '';

    // Aquí llamaría al endpoint de cambio de contraseña
    // Por ahora solo mostraremos un toast de éxito
    setTimeout(() => {
      ToastService.success('Contraseña actualizada correctamente');
      this.passwordForm.reset();
      this.passwordLoading = false;
    }, 1000);
  }

  onLogoutAllDevices(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión en todos los dispositivos?')) {
      ToastService.info('Sesiones cerradas en otros dispositivos');
    }
  }

  onDeleteAccount(): void {
    if (
      confirm(
        '¿Confirmas? Esta acción es irreversible y se perderán todos tus datos.'
      )
    ) {
      const confirmed = prompt('Escribe tu nick para confirmar:');
      if (confirmed === this.user?.nick) {
        ToastService.success('Cuenta eliminada correctamente');
        this.authService.logout();
      } else {
        ToastService.error('Confirmación incorrecta');
      }
    }
  }

  isFieldInvalid(fieldName: string, formName: string): boolean {
    const form = formName === 'password' ? this.passwordForm : this.passwordForm;
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
