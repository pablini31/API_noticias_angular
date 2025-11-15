import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header">
      <div class="header-left">
        <a class="brand" routerLink="/" title="Ir al inicio">
          <svg class="brand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <span class="brand-text">Noticias</span>
        </a>
        <nav class="nav">
          <a 
            routerLink="/" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            Inicio
          </a>
          <a 
            *ngIf="isAuthenticated" 
            routerLink="/dashboard" 
            routerLinkActive="active"
            class="nav-link"
          >
            Panel
          </a>
          <a 
            *ngIf="isAdmin" 
            routerLink="/admin" 
            routerLinkActive="active"
            class="nav-link"
          >
            Admin
          </a>
        </nav>
      </div>

      <div class="actions">
        <!-- <button 
          class="btn-theme" 
          (click)="toggleTheme()" 
          [attr.aria-label]="'Cambiar a modo ' + (theme === 'dark' ? 'claro' : 'oscuro')"
          title="Alternar tema"
        >
          <svg *ngIf="theme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg *ngIf="theme === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button> -->

        <ng-container *ngIf="isAuthenticated; else notAuth">
          <span class="user-nick" *ngIf="userNick">{{ userNick }}</span>
          <button class="btn ghost small" (click)="logout()">Salir</button>
        </ng-container>

        <ng-template #notAuth>
          <a class="btn ghost small" routerLink="/login">Acceder</a>
          <a class="btn primary small" routerLink="/register">Registrar</a>
        </ng-template>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .site-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-lg);
        padding: var(--spacing-md) var(--spacing-xl);
        background: var(--color-bg-card);
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        z-index: 100;
        animation: slideInDown var(--transition-base);
        backdrop-filter: blur(8px);
        background: rgba(254, 254, 253, 0.95);
      }

      @media (prefers-color-scheme: dark) {
        .site-header {
          background: rgba(47, 47, 47, 0.95);
        }
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-2xl);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: 1.125rem;
        font-weight: 600;
        letter-spacing: var(--letter-spacing-wide);
        color: var(--color-accent-primary);
        text-decoration: none;
        transition: all var(--transition-base);
        position: relative;
      }

      .brand-icon {
        transition: all var(--transition-base);
        stroke: currentColor;
      }

      .brand:hover .brand-icon {
        transform: translateY(-1px);
      }

      .brand:hover {
        color: var(--color-accent-primary-hover);
      }

      .brand::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: currentColor;
        transition: width var(--transition-base);
      }

      .brand:hover::after {
        width: 100%;
      }

      .nav {
        display: flex;
        gap: var(--spacing-xl);
        align-items: center;
      }

      .nav-link {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;
        letter-spacing: var(--letter-spacing);
        position: relative;
        transition: color var(--transition-base);
        padding: 0.375rem 0;
      }

      .nav-link:hover,
      .nav-link.active {
        color: var(--color-accent-primary);
      }

      .nav-link::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: var(--color-accent-primary);
        transition: width var(--transition-base);
      }

      .nav-link:hover::before,
      .nav-link.active::before {
        width: 100%;
      }

      .actions {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
      }

      .btn-theme {
        width: 2rem;
        height: 2rem;
        border-radius: var(--border-radius-md);
        border: 1px solid var(--color-border);
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-base);
        color: var(--color-text-secondary);
        padding: 0;
      }

      .btn-theme:hover {
        background: var(--color-bg-hover);
        border-color: var(--color-border-hover);
        color: var(--color-accent-primary);
        transform: translateY(-1px);
      }

      .btn-theme:active {
        transform: translateY(0) scale(0.95);
      }

      .btn-theme svg {
        transition: transform var(--transition-slow);
      }

      .btn-theme:hover svg {
        transform: rotate(20deg);
      }

      .user-nick {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
        padding: 0 var(--spacing-md);
        border-right: 1px solid var(--color-border-light);
        font-weight: 500;
        letter-spacing: var(--letter-spacing);
        animation: slideInRight var(--transition-base);
      }

      @media (max-width: 768px) {
        .site-header {
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .header-left {
          width: 100%;
          justify-content: space-between;
          gap: var(--spacing-md);
        }

        .nav {
          gap: var(--spacing-md);
          font-size: 0.9rem;
        }

        .actions {
          width: 100%;
          justify-content: flex-end;
          gap: var(--spacing-sm);
        }

        .user-nick {
          border-right: none;
          padding-right: 0;
          padding-left: var(--spacing-sm);
        }
      }

      @media (max-width: 480px) {
        .brand {
          font-size: 1.15rem;
          gap: 0.3rem;
        }

        .brand-text {
          display: none;
        }

        .nav-link {
          font-size: 0.85rem;
          padding: 0.3rem 0;
        }

        .actions {
          gap: 0.25rem;
        }

        .btn-theme {
          width: 36px;
          height: 36px;
          border-width: 1px;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  theme = (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
    ? 'dark'
    : 'light';
  isAuthenticated = false;
  isAdmin = false;
  userNick = '';

  ngOnInit(): void {
    this.authService.getAuthState$().subscribe((state) => {
      this.isAuthenticated = !!state.token;
      this.isAdmin = state.user?.perfil_id === 1 || false;
      this.userNick = state.user?.nick || '';
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
