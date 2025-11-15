import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
    console.log('🔧 JwtInterceptor initialized');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiRequest = request.url.includes('/api/');
    
    console.group(`🔐 JWT Interceptor - ${request.method} ${request.url}`);
    console.log('Is API request:', isApiRequest);
    
    if (isApiRequest) {
      // Obtener el token de AuthService
      const token = this.authService.getToken();
      console.log('Token exists:', !!token);
      
      if (token) {
        console.log('Token preview:', token.substring(0, 30) + '...');
        console.log('Token length:', token.length);
        
        // ADJUNTAR TOKEN A LA PETICIÓN
        const authToken = `Bearer ${token}`;
        request = request.clone({
          setHeaders: {
            Authorization: authToken,
          },
        });
        console.log('✅ Token attached successfully');
        console.log('Authorization header:', request.headers.get('Authorization')?.substring(0, 40) + '...');
      } else {
        console.warn('⚠️ NO TOKEN AVAILABLE - Request will be sent without Authorization header');
        console.log('This will result in 401 Unauthorized if endpoint requires authentication');
      }
    } else {
      console.log('✓ Not an API request, skipping token attachment');
    }
    console.groupEnd();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.group(`❌ HTTP Error - ${error.status} ${error.statusText}`);
        console.log('URL:', request.url);
        console.log('Status:', error.status);
        console.log('Error message:', error.error?.message);
        console.log('Full error:', error.error);
        
        // Handle 401 Unauthorized - token expired or invalid
        if (error.status === 401) {
          console.error('🚫 401 Unauthorized - Token invalid or expired. Logging out...');
          this.authService.logout();
        }
        console.groupEnd();
        
        return throwError(() => error);
      })
    );
  }
}
