import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

interface AuthDiagnostics {
  isAuthenticated: boolean;
  tokenExists: boolean;
  tokenInMemory: string | null;
  tokenInLocalStorage: string | null;
  tokenMatches: boolean;
  tokenPreview: string | null;
  tokenValid: boolean;
  tokenExpired: boolean;
  expiresIn: number | null;
  decodedToken: any;
  currentUser: any;
  userInMemory: any;
  userInLocalStorage: any;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class DiagnosticService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  testEndpoint(url: string): Observable<any> {
    console.log(`[DIAGNOSTIC] Testing endpoint: ${url}`);
    return this.http.get<any>(url, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('[DIAGNOSTIC] Full Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          body: response.body,
          headers: response.headers,
          type: response.type,
        });
      })
    );
  }

  /**
   * Get complete authentication diagnostics
   */
  getAuthDiagnostics(): AuthDiagnostics {
    const tokenInMemory = this.authService.getToken();
    const tokenInLocalStorage = localStorage.getItem('auth_token');
    const currentUser = this.authService.getUser();
    const userInLocalStorage = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') || '{}') : null;

    let tokenValid = false;
    let tokenExpired = false;
    let expiresIn: number | null = null;
    let decodedToken: any = null;

    if (tokenInMemory) {
      try {
        decodedToken = jwtDecode(tokenInMemory);
        tokenValid = true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp) {
          expiresIn = decodedToken.exp - currentTime;
          tokenExpired = expiresIn < 0;
        }
      } catch (error) {
        tokenValid = false;
        console.error('Error decoding token:', error);
      }
    }

    return {
      isAuthenticated: this.authService.isAuthenticated(),
      tokenExists: !!tokenInMemory,
      tokenInMemory: tokenInMemory ? tokenInMemory.substring(0, 30) + '...' : null,
      tokenInLocalStorage: tokenInLocalStorage ? tokenInLocalStorage.substring(0, 30) + '...' : null,
      tokenMatches: tokenInMemory === tokenInLocalStorage,
      tokenPreview: tokenInMemory ? tokenInMemory.substring(0, 50) : null,
      tokenValid,
      tokenExpired,
      expiresIn,
      decodedToken,
      currentUser,
      userInMemory: currentUser,
      userInLocalStorage,
      timestamp: new Date().toISOString(),
    };
  }
}

