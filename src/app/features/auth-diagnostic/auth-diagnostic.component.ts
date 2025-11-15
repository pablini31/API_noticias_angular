import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiagnosticService } from '../../core/services/diagnostic.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth-diagnostic',
  imports: [CommonModule, RouterModule],
  styles: [`
    .diagnostic-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      border-bottom: 2px solid #007bff;
      padding-bottom: 1rem;
    }

    .diagnostic-section {
      background: white;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }

    .diagnostic-section h2 {
      color: #007bff;
      font-size: 16px;
      margin-bottom: 1rem;
      margin-top: 0;
    }

    .diagnostic-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .diagnostic-item:last-child {
      border-bottom: none;
    }

    .diagnostic-label {
      font-weight: bold;
      color: #333;
      width: 40%;
    }

    .diagnostic-value {
      word-break: break-all;
      color: #555;
      width: 60%;
      text-align: right;
    }

    .status-true {
      color: #28a745;
      font-weight: bold;
    }

    .status-false {
      color: #dc3545;
      font-weight: bold;
    }

    .status-warning {
      color: #ffc107;
      font-weight: bold;
    }

    .json-display {
      background: #f9f9f9;
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #0056b3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .success {
      color: #28a745;
    }

    .error {
      color: #dc3545;
    }

    .warning {
      color: #ffc107;
    }

    .info {
      color: #17a2b8;
    }
  `],
  template: `
    <div class="diagnostic-container">
      <h1>🔐 Authentication Diagnostic Dashboard</h1>

      <!-- Authentication Status -->
      <div class="diagnostic-section">
        <h2>Authentication Status</h2>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Is Authenticated</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.isAuthenticated ? 'status-true' : 'status-false'">
            {{diagnostics.isAuthenticated ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Token Exists</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.tokenExists ? 'status-true' : 'status-false'">
            {{diagnostics.tokenExists ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Tokens Match</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.tokenMatches ? 'status-true' : 'status-false'">
            {{diagnostics.tokenMatches ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
      </div>

      <!-- Token Details -->
      <div class="diagnostic-section">
        <h2>Token Details</h2>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Token Valid</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.tokenValid ? 'status-true' : 'status-false'">
            {{diagnostics.tokenValid ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Token Expired</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.tokenExpired ? 'status-false' : 'status-true'">
            {{diagnostics.tokenExpired ? '✓ EXPIRED' : '✗ ACTIVE'}}
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Expires In (seconds)</span>
          <span class="diagnostic-value">
            <span [ngClass]="(diagnostics.expiresIn || 0) > 0 ? 'status-true' : 'status-false'">
              {{diagnostics.expiresIn || 'N/A'}}
            </span>
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Token Preview</span>
          <span class="diagnostic-value info">{{diagnostics.tokenPreview || 'N/A'}}</span>
        </div>
      </div>

      <!-- User Details -->
      <div class="diagnostic-section">
        <h2>Current User</h2>
        <div *ngIf="diagnostics.currentUser; else noUser">
          <div class="diagnostic-item">
            <span class="diagnostic-label">User ID</span>
            <span class="diagnostic-value">{{diagnostics.currentUser.id}}</span>
          </div>
          <div class="diagnostic-item">
            <span class="diagnostic-label">Name</span>
            <span class="diagnostic-value">{{diagnostics.currentUser.nombre}} {{diagnostics.currentUser.apellidos}}</span>
          </div>
          <div class="diagnostic-item">
            <span class="diagnostic-label">Email</span>
            <span class="diagnostic-value">{{diagnostics.currentUser.correo}}</span>
          </div>
          <div class="diagnostic-item">
            <span class="diagnostic-label">Profile ID</span>
            <span class="diagnostic-value">{{diagnostics.currentUser.perfil_id}}</span>
          </div>
        </div>
        <ng-template #noUser>
          <div class="diagnostic-item">
            <span class="diagnostic-label">Status</span>
            <span class="diagnostic-value error">No user logged in</span>
          </div>
        </ng-template>
      </div>

      <!-- Decoded Token -->
      <div class="diagnostic-section">
        <h2>Decoded JWT Token</h2>
        <div *ngIf="diagnostics.decodedToken; else noToken">
          <div class="json-display">{{diagnostics.decodedToken | json}}</div>
        </div>
        <ng-template #noToken>
          <div class="diagnostic-item">
            <span class="diagnostic-label">Status</span>
            <span class="diagnostic-value error">No valid token to decode</span>
          </div>
        </ng-template>
      </div>

      <!-- Local Storage Status -->
      <div class="diagnostic-section">
        <h2>Local Storage Status</h2>
        <div class="diagnostic-item">
          <span class="diagnostic-label">Token in localStorage</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.tokenInLocalStorage ? 'status-true' : 'status-false'">
            {{diagnostics.tokenInLocalStorage ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
        <div class="diagnostic-item">
          <span class="diagnostic-label">User in localStorage</span>
          <span class="diagnostic-value" [ngClass]="diagnostics.userInLocalStorage ? 'status-true' : 'status-false'">
            {{diagnostics.userInLocalStorage ? '✓ YES' : '✗ NO'}}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="button-group">
        <button (click)="refresh()">🔄 Refresh Diagnostics</button>
        <button (click)="logout()">🚪 Logout</button>
        <button (click)="testApiCall()">🧪 Test API Call</button>
        <button routerLink="/">← Back to Home</button>
      </div>

      <!-- Test Result -->
      <div *ngIf="testResult" class="diagnostic-section">
        <h2>API Test Result</h2>
        <div class="json-display">{{testResult | json}}</div>
      </div>

      <!-- Last Updated -->
      <div style="text-align: center; margin-top: 2rem; color: #999;">
        <small>Last updated: {{diagnostics.timestamp}}</small>
      </div>
    </div>
  `
})
export class AuthDiagnosticComponent implements OnInit {
  diagnostics: any = {};
  testResult: any = null;

  constructor(
    private diagnosticService: DiagnosticService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    console.clear();
    this.diagnostics = this.diagnosticService.getAuthDiagnostics();
    console.log('📊 Diagnostic Report:', this.diagnostics);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.refresh();
    }
  }

  testApiCall() {
    console.log('🧪 Testing API call with current token...');
    this.diagnosticService.testEndpoint('/api/profile').subscribe({
      next: (result) => {
        this.testResult = result;
        console.log('✅ API call successful:', result);
      },
      error: (error) => {
        this.testResult = {
          success: false,
          status: error.status,
          message: error.error?.message || error.message,
          error: error.error
        };
        console.error('❌ API call failed:', error);
      }
    });
  }
}
