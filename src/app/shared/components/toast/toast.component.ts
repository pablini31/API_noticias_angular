import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts; let i = index"
        class="toast"
        [ngClass]="'toast-' + toast.type"
        [@slideInRight]
        (mouseenter)="onHover(toast.id)"
        (mouseleave)="onHoverEnd(toast.id)"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <div class="toast-content">
          <span class="toast-message">{{ toast.message }}</span>
          <div class="toast-progress" [style.animation-play-state]="hoveredId === toast.id ? 'paused' : 'running'"></div>
        </div>
        <button class="toast-close" (click)="removeToast(toast.id)" title="Cerrar">
          <span>✕</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: var(--spacing-xl);
        right: var(--spacing-lg);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        font-size: 0.95rem;
        box-shadow: var(--shadow-lg);
        animation: slideInRight var(--transition-base), fadeOut var(--transition-base) 3.5s ease-in-out 3.5s forwards;
        pointer-events: auto;
        max-width: 380px;
        border-left: 3px solid;
        background: var(--color-bg-card);
        border-color: currentColor;
        overflow: hidden;
        position: relative;
      }

      .toast::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: currentColor;
        opacity: 0.3;
        animation: shrinkWidth 4s linear forwards;
      }

      @keyframes shrinkWidth {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      @keyframes fadeOut {
        0%, 90% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(400px);
        }
      }

      .toast-success {
        color: var(--color-success);
        border-left-color: var(--color-success);
        background: linear-gradient(135deg, rgba(45, 127, 63, 0.08) 0%, transparent 100%);
      }

      .toast-error {
        color: var(--color-error);
        border-left-color: var(--color-error);
        background: linear-gradient(135deg, rgba(197, 48, 48, 0.08) 0%, transparent 100%);
      }

      .toast-info {
        color: var(--color-info);
        border-left-color: var(--color-info);
        background: linear-gradient(135deg, rgba(11, 83, 148, 0.08) 0%, transparent 100%);
      }

      .toast-warning {
        color: var(--color-warning);
        border-left-color: var(--color-warning);
        background: linear-gradient(135deg, rgba(205, 125, 31, 0.08) 0%, transparent 100%);
      }

      .toast-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        margin-top: 2px;
        animation: bounce var(--transition-base);
      }

      .toast-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .toast-message {
        font-weight: 500;
        line-height: 1.4;
        display: block;
      }

      .toast-progress {
        height: 1px;
        background: currentColor;
        opacity: 0.2;
        border-radius: 1px;
        animation: progressBar 4s linear forwards;
      }

      @keyframes progressBar {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      .toast-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.2rem;
        padding: var(--spacing-xs) var(--spacing-sm);
        flex-shrink: 0;
        transition: all var(--transition-fast);
        opacity: 0.7;
        border-radius: var(--border-radius-sm);
        margin: -2px 0;
      }

      .toast-close:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.05);
        transform: scale(1.1);
      }

      .toast-close:active {
        transform: scale(0.95);
      }

      .toast:hover {
        box-shadow: var(--shadow-xl);
        transform: translateY(-2px);
      }

      @media (max-width: 640px) {
        .toast-container {
          top: var(--spacing-lg);
          left: var(--spacing-lg);
          right: var(--spacing-lg);
          gap: var(--spacing-sm);
        }

        .toast {
          max-width: 100%;
          font-size: 0.9rem;
          padding: var(--spacing-md);
        }

        .toast-icon {
          font-size: 1.1rem;
        }

        .toast-close {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];
  hoveredId: string | null = null;

  ngOnInit(): void {
    ToastService.instance$.subscribe((toast: any) => {
      if (toast) {
        this.addToast(toast);
      }
    });
  }

  addToast(toast: Toast): void {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration || 4000;
    this.toasts.push({ ...toast, id });

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  onHover(id: string): void {
    this.hoveredId = id;
  }

  onHoverEnd(id: string): void {
    if (this.hoveredId === id) {
      this.hoveredId = null;
    }
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };
    return icons[type] || '•';
  }
}

export class ToastService {
  static instance$ = new BehaviorSubject<Toast | null>(null);

  static success(message: string, duration?: number): void {
    this.instance$.next({ message, type: 'success', id: '', duration });
  }

  static error(message: string, duration?: number): void {
    this.instance$.next({ message, type: 'error', id: '', duration });
  }

  static info(message: string, duration?: number): void {
    this.instance$.next({ message, type: 'info', id: '', duration });
  }

  static warning(message: string, duration?: number): void {
    this.instance$.next({ message, type: 'warning', id: '', duration });
  }
}
