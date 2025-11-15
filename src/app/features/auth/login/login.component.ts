import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { ToastService } from '../../../shared/components/toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-accent"></div>
          <h1 class="auth-title">Acceder</h1>
          <p class="auth-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Correo</label>
            <input
              id="email"
              type="email"
              formControlName="correo"
              placeholder="correo@ejemplo.com"
              class="form-input"
              autocomplete="email"
              [class.invalid]="isFieldInvalid('correo')"
            />
            <p class="form-error" *ngIf="isFieldInvalid('correo')">
              Correo inválido
            </p>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="contraseña"
              placeholder="••••••••"
              class="form-input"
              autocomplete="current-password"
              [class.invalid]="isFieldInvalid('contraseña')"
            />
            <p class="form-error" *ngIf="isFieldInvalid('contraseña')">
              Campo requerido
            </p>
          </div>

          <div class="alert error" *ngIf="errorMessage">
            <span class="alert-icon">!</span>
            <div>{{ errorMessage }}</div>
          </div>

          <button 
            type="submit" 
            [disabled]="!loginForm.valid || loading" 
            class="btn primary"
          >
            <span *ngIf="!loading">Iniciar sesión</span>
            <span *ngIf="loading" class="loading-text">
              <span class="spinner-dot"></span> Iniciando...
            </span>
          </button>
        </form>

        <div class="auth-divider">
          <span>o</span>
        </div>

        <p class="auth-footer">
          ¿Sin cuenta?
          <a routerLink="/register" class="auth-link">Crear una</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--color-bg-primary);
        padding: var(--spacing-lg);
        animation: fadeIn var(--transition-base);
      }

      .auth-card {
        width: 100%;
        max-width: 400px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-xl);
        box-shadow: var(--shadow-md);
        animation: slideInUp var(--transition-base);
      }

      .auth-header {
        text-align: center;
        margin-bottom: var(--spacing-xl);
      }

      .auth-icon {
        font-size: 2.5rem;
        display: inline-block;
        margin-bottom: var(--spacing-md);
        animation: bounce var(--transition-base);
      }

      .auth-title {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .auth-subtitle {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.95rem;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        animation: slideInUp var(--transition-base);
      }

      .form-label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--color-text-primary);
        letter-spacing: 0.2px;
      }

      .form-input {
        padding: var(--spacing-md) var(--spacing-lg);
        border: 1.5px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        font-size: 1rem;
        background: var(--color-bg-input);
        color: var(--color-text-primary);
        transition: all var(--transition-base);
        font-family: inherit;
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-accent-primary);
        box-shadow: 0 0 0 3px rgba(212, 68, 63, 0.08);
      }

      .form-input.invalid {
        border-color: var(--color-error);
        background: rgba(197, 48, 48, 0.02);
      }

      .form-input::placeholder {
        color: var(--color-text-tertiary);
      }

      .form-error {
        margin: 0;
        color: var(--color-error);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        animation: slideInUp var(--transition-fast);
      }

      .form-error::before {
        content: '⚠';
        font-weight: bold;
      }

      .alert {
        animation: slideInUp var(--transition-base);
      }

      .btn {
        font-weight: 600;
        letter-spacing: 0.3px;
        position: relative;
      }

      .btn-large {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      .loading-spinner {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .spinner-dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        animation: softPulse var(--transition-base);
      }

      .auth-divider {
        text-align: center;
        color: var(--color-text-tertiary);
        margin: var(--spacing-lg) 0;
        position: relative;
        font-size: 0.9rem;
      }

      .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--color-border);
        z-index: 0;
      }

      .auth-divider {
        background: var(--color-bg-card);
        padding: 0 var(--spacing-md);
        position: relative;
        z-index: 1;
      }

      .auth-footer {
        text-align: center;
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin: 0;
      }

      .auth-link {
        color: var(--color-accent-primary);
        text-decoration: none;
        font-weight: 600;
        transition: all var(--transition-fast);
        position: relative;
      }

      .auth-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--color-accent-primary);
        transition: width var(--transition-base);
      }

      .auth-link:hover {
        color: var(--color-accent-primary-hover);
      }

      .auth-link:hover::after {
        width: 100%;
      }

      @media (max-width: 480px) {
        .auth-container {
          padding: var(--spacing-md);
        }

        .auth-card {
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-lg);
        }

        .auth-title {
          font-size: 1.5rem;
        }

        .form-input {
          padding: var(--spacing-md);
          font-size: 16px;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = this.loginForm.value;
    
    console.log('📤 Submitting login form with:', {
      correo: credentials.correo,
      hasPassword: !!credentials.contraseña
    });

    this.authService.login(credentials).subscribe({
      next: () => {
        ToastService.success('¡Bienvenido! Iniciaste sesión correctamente', 3000);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('🚫 Login component received error:', err);
        
        // Extract the most specific error message
        let errorMsg = 'Error al iniciar sesión. Verifica tus credenciales.';
        
        if (typeof err === 'string') {
          errorMsg = err;
        } else if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        }
        
        this.errorMessage = errorMsg;
        ToastService.error(errorMsg);
      },
    });
  }
}
