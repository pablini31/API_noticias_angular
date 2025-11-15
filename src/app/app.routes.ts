import { Routes } from '@angular/router';
import { NewsListComponent } from './components/news-list/news-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component';
import { NewsDetailComponent } from './features/news-detail/news-detail.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthDiagnosticComponent } from './features/auth-diagnostic/auth-diagnostic.component';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: NewsListComponent, data: { title: 'Inicio' } },
  { path: 'login', component: LoginComponent, data: { title: 'Acceder' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Crear Cuenta' } },
  
  // Ruta de detalle de noticia (pública)
  { path: 'news/:id', component: NewsDetailComponent, data: { title: 'Detalle de Noticia' } },

  // Ruta de diagnóstico (pública para debugging)
  { path: 'diagnostic', component: AuthDiagnosticComponent, data: { title: 'Diagnostic' } },

  // Rutas protegidas (usuarios autenticados)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Mi Panel' }
  },

  // Rutas de administración
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    data: { title: 'Administración' }
  },

  // Ruta por defecto para rutas no encontradas
  { path: '**', redirectTo: '' },
];

