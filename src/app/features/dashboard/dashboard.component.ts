import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyNewsComponent } from './my-news/my-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { ProfileComponent } from './profile/profile.component';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, MyNewsComponent, CreateNewsComponent, ProfileComponent, MyFavoritesComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div class="header-accent"></div>
        <h1 class="dashboard-title">Panel de Control</h1>
        <p class="dashboard-subtitle">Gestión de contenido</p>
      </div>

      <div class="dashboard-nav">
        <nav class="nav-tabs">
          <button
            class="nav-tab"
            [class.active]="activeTab === 'my-news'"
            (click)="setActiveTab('my-news')"
            type="button"
          >
            <svg class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
              <line x1="7" y1="16" x2="13" y2="16"/>
            </svg>
            <span class="tab-label">Artículos</span>
          </button>
          <button
            class="nav-tab"
            [class.active]="activeTab === 'create'"
            (click)="setActiveTab('create')"
            type="button"
          >
            <svg class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span class="tab-label">Crear</span>
          </button>
          <button
            class="nav-tab"
            [class.active]="activeTab === 'profile'"
            (click)="setActiveTab('profile')"
            type="button"
          >
            <svg class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="tab-label">Perfil</span>
          </button>
          <button
            class="nav-tab"
            [class.active]="activeTab === 'favorites'"
            (click)="setActiveTab('favorites')"
            type="button"
          >
            <svg class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="tab-label">Favoritos</span>
          </button>
        </nav>
      </div>

      <div class="dashboard-content">
        <div *ngIf="activeTab === 'my-news'" class="tab-content" [@slideInUp]>
          <app-my-news></app-my-news>
        </div>
        <div *ngIf="activeTab === 'create'" class="tab-content" [@slideInUp]>
          <app-create-news></app-create-news>
        </div>
        <div *ngIf="activeTab === 'profile'" class="tab-content" [@slideInUp]>
          <app-profile></app-profile>
        </div>
        <div *ngIf="activeTab === 'favorites'" class="tab-content" [@slideInUp]>
          <app-my-favorites></app-my-favorites>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: var(--spacing-xl) var(--spacing-2xl);
        max-width: 1100px;
        margin: 0 auto;
        min-height: calc(100vh - 64px);
      }

      .dashboard-header {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
        padding-bottom: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
        animation: slideInUp var(--transition-base);
        position: relative;
      }

      .header-accent {
        width: 40px;
        height: 2px;
        background: var(--color-accent-primary);
        margin: 0 auto var(--spacing-md);
        animation: slideInRight var(--transition-slow);
      }

      .dashboard-title {
        font-size: clamp(1.5rem, 4vw, 1.875rem);
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-xs) 0;
        letter-spacing: var(--letter-spacing-wide);
      }

      .dashboard-subtitle {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        margin: 0;
        font-weight: 400;
        letter-spacing: var(--letter-spacing);
      }

      .dashboard-nav {
        margin-bottom: var(--spacing-xl);
        animation: slideInUp var(--transition-base);
        animation-delay: 50ms;
      }

      .nav-tabs {
        display: flex;
        gap: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 1px;
      }

      .nav-tabs::-webkit-scrollbar {
        height: 3px;
      }

      .nav-tabs::-webkit-scrollbar-track {
        background: transparent;
      }

      .nav-tabs::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 2px;
      }

      .nav-tab {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
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
        position: relative;
        white-space: nowrap;
      }

      .tab-icon {
        display: inline-flex;
        transition: all var(--transition-base);
        stroke: currentColor;
      }

      .tab-label {
        letter-spacing: var(--letter-spacing);
      }

      .nav-tab:hover {
        color: var(--color-accent-primary);
        transform: translateY(-1px);
      }

      .nav-tab:hover .tab-icon {
        transform: scale(1.08);
      }

      .nav-tab.active {
        color: var(--color-accent-primary);
        border-bottom-color: var(--color-accent-primary);
      }

      .nav-tab.active .tab-icon {
        animation: gentleFloat 2s ease-in-out infinite;
      }

      .dashboard-content {
        animation: slideInUp var(--transition-base);
        animation-delay: 100ms;
      }

      .tab-content {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-xl);
        animation: fadeIn var(--transition-base);
        transition: all var(--transition-base);
      }

      /* RESPONSIVE */
      @media (max-width: 768px) {
        .dashboard {
          padding: var(--spacing-lg) var(--spacing-md);
        }

        .dashboard-header {
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-md);
        }

        .dashboard-title {
          font-size: 1.5rem;
        }

        .nav-tabs {
          gap: 0.25rem;
        }

        .nav-tab {
          padding: var(--spacing-sm);
          font-size: 0.75rem;
        }

        .tab-content {
          padding: var(--spacing-lg);
        }
      }

      @media (max-width: 480px) {
        .dashboard {
          padding: var(--spacing-md);
        }

        .dashboard-title {
          font-size: 1.25rem;
        }

        .header-accent {
          width: 30px;
          margin-bottom: var(--spacing-sm);
        }

        .nav-tab {
          padding: 0.375rem 0.5rem;
        }

        .tab-label {
          display: none;
        }

        .tab-content {
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  activeTab: 'my-news' | 'create' | 'profile' | 'favorites' = 'my-news';

  ngOnInit(): void {}

  setActiveTab(tab: 'my-news' | 'create' | 'profile' | 'favorites'): void {
    this.activeTab = tab;
  }
}
