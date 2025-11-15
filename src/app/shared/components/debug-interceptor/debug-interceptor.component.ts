import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-debug-interceptor',
  imports: [CommonModule],
  styles: [`
    .debug-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1e1e1e;
      color: #00ff00;
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 15px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 10000;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }

    .debug-title {
      font-weight: bold;
      color: #ffff00;
      margin-bottom: 10px;
      border-bottom: 1px solid #00ff00;
      padding-bottom: 5px;
    }

    .debug-item {
      margin: 5px 0;
      padding: 5px;
      background: rgba(0, 255, 0, 0.1);
      border-left: 2px solid #00ff00;
      padding-left: 10px;
    }

    .status-ok { color: #00ff00; }
    .status-error { color: #ff0000; }
    .status-warn { color: #ffff00; }

    button {
      margin-top: 10px;
      padding: 5px 10px;
      background: #00ff00;
      color: #000;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background: #00cc00;
    }
  `],
  template: `
    <!-- Debug Panel Disabled -->
  `
})
export class DebugInterceptorComponent implements OnInit {
  interceptorInitialized = false;
  isAuthenticated = false;
  tokenExists = false;
  tokenPreview = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    console.log('🔍 Debug Interceptor Component Created');
  }

  ngOnInit() {
    console.log('🔍 Debug Component Initialized');
    this.updateStatus();
    
    // Check every second if things change
    setInterval(() => this.updateStatus(), 1000);
  }

  updateStatus() {
    this.isAuthenticated = this.authService.isAuthenticated();
    const token = this.authService.getToken();
    this.tokenExists = !!token;
    this.tokenPreview = token ? token.substring(0, 20) + '...' : '';
  }

  testCall() {
    console.log('🧪 Making test API call...');
    this.http.get('/api/profile').subscribe({
      next: (data) => console.log('✅ Success:', data),
      error: (err) => console.error('❌ Error:', err)
    });
  }
}
