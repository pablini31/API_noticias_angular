import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggleTheme()" 
      class="theme-toggle"
      [attr.aria-label]="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
    >
      <span class="icon">{{ isDark ? '☀️' : '🌙' }}</span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--color-accent-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .theme-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }

    .icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    @media (max-width: 768px) {
      .theme-toggle {
        bottom: 1rem;
        right: 1rem;
        width: 48px;
        height: 48px;
      }

      .icon {
        font-size: 1.25rem;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  ngOnInit() {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
