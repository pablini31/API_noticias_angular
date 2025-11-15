import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { CategoryService } from '../../../core/services/category.service';
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.component';
import { Category } from '../../../core/models/category.model';
import { State } from '../../../core/models/state.model';

@Component({
  standalone: true,
  selector: 'app-create-news',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-news">
      <div class="form-header">
        <h2>Crear Nueva Noticia</h2>
        <p class="subtitle">Comparte tu artículo con la comunidad</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="news-form">
        <!-- Título -->
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input
            id="titulo"
            type="text"
            formControlName="titulo"
            placeholder="Ingresa un título atractivo"
            class="form-control"
          />
          <span *ngIf="isFieldInvalid('titulo')" class="error-text">
            El título es requerido (mínimo 5 caracteres)
          </span>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="descripcion">Contenido del Artículo *</label>
          <textarea
            id="descripcion"
            formControlName="descripcion"
            placeholder="Escribe el contenido completo del artículo (mínimo 10 caracteres)"
            rows="8"
            class="form-control"
          ></textarea>
          <span *ngIf="isFieldInvalid('descripcion')" class="error-text">
            El contenido es requerido (mínimo 10 caracteres)
          </span>
        </div>

        <!-- Imagen -->
        <div class="form-group">
          <label for="imagen">Imagen *</label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            (change)="onImageSelected($event)"
            class="form-control"
          />
          <span *ngIf="isFieldInvalid('imagen')" class="error-text">
            Se requiere una imagen (formato: jpg, png, webp)
          </span>
          <div *ngIf="imagePreview" class="image-preview">
            <img [src]="imagePreview" alt="Preview" />
          </div>
        </div>

        <!-- Categoría -->
        <div class="form-row">
          <div class="form-group">
            <label for="categoria">Categoría *</label>
            <select formControlName="categoria_id" id="categoria" class="form-control">
              <option value="">Selecciona una categoría</option>
              <option *ngFor="let cat of categories" [value]="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
            <span *ngIf="isFieldInvalid('categoria_id')" class="error-text">
              La categoría es requerida
            </span>
          </div>

          <!-- Estado -->
          <div class="form-group">
            <label for="estado">Estado *</label>
            <select formControlName="estado_id" id="estado" class="form-control">
              <option value="">Selecciona un estado</option>
              <option *ngFor="let state of states" [value]="state.id">
                {{ state.nombre }}
              </option>
            </select>
            <span *ngIf="isFieldInvalid('estado_id')" class="error-text">
              El estado es requerido
            </span>
          </div>
        </div>

        <!-- Errores generales -->
        <div *ngIf="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="router.navigate(['/dashboard'])"
            [disabled]="loading"
          >
            ← Cancelar
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="loading || !form.valid">
            <span *ngIf="!loading">✓ Publicar Noticia</span>
            <span *ngIf="loading">⏳ Publicando...</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .create-news {
        max-width: 900px;
      }

      .form-header {
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 1rem;
      }

      .form-header h2 {
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

      .news-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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

      textarea.form-control {
        resize: vertical;
        min-height: 100px;
      }

      .error-text {
        color: #b91c1c;
        font-size: 0.8rem;
        display: block;
      }

      .image-preview {
        margin-top: 1rem;
        border-radius: 4px;
        overflow: hidden;
        max-width: 300px;
      }

      .image-preview img {
        width: 100%;
        height: auto;
        display: block;
      }

      .error-banner {
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 4px;
        padding: 1rem;
        color: #b91c1c;
        margin: 0;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.2s ease;
        min-width: 150px;
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

      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-light);
      }

      .btn-secondary:hover:not(:disabled) {
        background: var(--accent-light);
        color: white;
      }

      html.dark .error-text {
        color: #fca5a5;
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
        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class CreateNewsComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  states: State[] = [];
  loading = false;
  errorMessage = '';
  imagePreview: string | null = null;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private categoryService: CategoryService,
    private stateService: StateService,
    private authService: AuthService,
    public router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadStates();
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      imagen: ['', Validators.required],
      categoria_id: ['', Validators.required],
      estado_id: ['', Validators.required],
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        ToastService.error('Error al cargar categorías');
      },
    });
  }

  private loadStates(): void {
    this.stateService.getAll().subscribe({
      next: (data) => {
        this.states = data;
      },
      error: () => {
        ToastService.error('Error al cargar estados');
      },
    });
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ imagen: file.name });
    }
  }

  onSubmit(): void {
    if (!this.form.valid || !this.imageFile) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Convertir imagen a base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Full = e.target.result;
      
      // Extraer solo el base64 sin el prefijo "data:image/...;base64,"
      const base64Image = base64Full.includes(',') ? base64Full.split(',')[1] : base64Full;
      
      console.log('📸 Imagen procesada:');
      console.log('- Longitud total:', base64Full.length);
      console.log('- Tiene prefijo:', base64Full.includes('data:'));
      console.log('- Longitud base64 puro:', base64Image.length);
      console.log('- Primeros 50 caracteres:', base64Image.substring(0, 50));
      console.log('- Últimos 10 caracteres:', base64Image.substring(base64Image.length - 10));

      // Preparar datos según API spec
      const newsData = {
        titulo: this.form.value.titulo.trim(),
        descripcion: this.form.value.descripcion.trim(),
        imagen: base64Image,
        categoria_id: Number(this.form.value.categoria_id),
        estado_id: Number(this.form.value.estado_id),
        fecha_publicacion: new Date().toISOString(),
        // estado_publicacion: 'borrador', // API defaults to 'borrador', no need to send
        // activo: true, // API defaults to true
        // usuario_id se obtiene del token JWT automáticamente
      };
      
      console.log('📤 Datos a enviar:', {
        ...newsData,
        imagen: newsData.imagen.substring(0, 50) + '...'
      });

      this.newsService.create(newsData).subscribe({
        next: () => {
          ToastService.success('¡Noticia publicada correctamente!');
          this.router.navigate(['/dashboard/my-news']);
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Error completo al crear noticia:', err);
          
          // Mensajes de error más específicos
          if (err.status === 401) {
            this.errorMessage = 'No estás autenticado. Por favor inicia sesión nuevamente.';
          } else if (err.status === 400) {
            this.errorMessage = err.error?.message || 'Datos inválidos. Verifica todos los campos.';
          } else if (err.status === 500) {
            this.errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
          } else {
            this.errorMessage = err.error?.message || err.message || 'Error al publicar la noticia';
          }
          
          ToastService.error(this.errorMessage);
        },
      });
    };
    reader.readAsDataURL(this.imageFile);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
