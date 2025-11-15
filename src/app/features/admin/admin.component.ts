import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { StateManagementComponent } from './state-management/state-management.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { NewsManagementComponent } from './news-management/news-management.component';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    UserManagementComponent,
    CategoryManagementComponent,
    StateManagementComponent,
    ProfileManagementComponent,
    NewsManagementComponent,
  ],
  template: `
    <div class="page-container">
      <div class="app-container">
        <div class="admin-panel">
          <div class="admin-header">
            <div class="header-accent"></div>
            <h1>Administración</h1>
            <p class="subtitle">Gestión del sistema</p>
          </div>

          <div class="admin-nav">
            <nav class="nav-tabs">
              <button
                class="nav-tab"
                [class.active]="activeTab === 'users'"
                (click)="activeTab = 'users'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Usuarios</span>
              </button>
              <button
                class="nav-tab"
                [class.active]="activeTab === 'categories'"
                (click)="activeTab = 'categories'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Categorías</span>
              </button>
              <button
                class="nav-tab"
                [class.active]="activeTab === 'states'"
                (click)="activeTab = 'states'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
                <span>Estados</span>
              </button>
              <button
                class="nav-tab"
                [class.active]="activeTab === 'profiles'"
                (click)="activeTab = 'profiles'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Perfiles</span>
              </button>
              <button
                class="nav-tab"
                [class.active]="activeTab === 'news'"
                (click)="activeTab = 'news'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="7" y1="8" x2="17" y2="8"/>
                  <line x1="7" y1="12" x2="17" y2="12"/>
                  <line x1="7" y1="16" x2="13" y2="16"/>
                </svg>
                <span>Noticias</span>
              </button>
            </nav>
          </div>

          <div class="admin-content">
            <div *ngIf="activeTab === 'users'" class="tab-content">
              <app-user-management></app-user-management>
            </div>
            <div *ngIf="activeTab === 'categories'" class="tab-content">
              <app-category-management></app-category-management>
            </div>
            <div *ngIf="activeTab === 'states'" class="tab-content">
              <app-state-management></app-state-management>
            </div>
            <div *ngIf="activeTab === 'profiles'" class="tab-content">
              <app-profile-management></app-profile-management>
            </div>
            <div *ngIf="activeTab === 'news'" class="tab-content">
              <app-news-management></app-news-management>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        min-height: calc(100vh - 80px);
        background: var(--color-bg-primary);
        padding: var(--spacing-xl) 0;
      }

      .admin-panel {
        min-height: 600px;
      }

      .admin-header {
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
        text-align: center;
      }

      .header-accent {
        width: 40px;
        height: 2px;
        background: var(--color-accent-primary);
        margin: 0 auto var(--spacing-md);
      }

      .admin-header h1 {
        font-size: 1.75rem;
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-xs) 0;
        font-weight: 600;
        letter-spacing: var(--letter-spacing-wide);
      }

      .subtitle {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        margin: 0;
        letter-spacing: var(--letter-spacing);
      }

      .admin-nav {
        margin-bottom: var(--spacing-xl);
        overflow-x: auto;
      }

      .nav-tabs {
        display: flex;
        gap: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border);
        min-width: min-content;
      }

      .nav-tab {
        padding: var(--spacing-sm) var(--spacing-md);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        font-size: 0.8125rem;
        font-weight: 500;
        letter-spacing: var(--letter-spacing);
        transition: all var(--transition-base);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .nav-tab svg {
        stroke: currentColor;
        transition: transform var(--transition-base);
      }

      .nav-tab:hover {
        color: var(--color-accent-primary);
        border-bottom-color: var(--color-border-hover);
        transform: translateY(-1px);
      }

      .nav-tab:hover svg {
        transform: scale(1.1);
      }

      .nav-tab.active {
        color: var(--color-accent-primary);
        border-bottom-color: var(--color-accent-primary);
      }

      .nav-tab.active svg {
        animation: gentleFloat 2s ease-in-out infinite;
      }

      .admin-content {
        animation: fadeIn var(--transition-base);
      }

      .tab-content {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        min-height: 500px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .page-container {
          padding: var(--spacing-lg) 0;
        }

        .admin-header h1 {
          font-size: 1.5rem;
        }

        .nav-tabs {
          gap: var(--spacing-sm);
        }

        .nav-tab {
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: 0.85rem;
        }
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  activeTab: 'users' | 'categories' | 'states' | 'profiles' | 'news' = 'users';

  ngOnInit(): void {}
}
