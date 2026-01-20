import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-display font-bold text-primary">RMRTS</h1>
          <p class="text-secondary mt-2">Restaurant Menu & Reservation System</p>
        </div>

        <!-- Role Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-secondary-dark mb-3">Login as:</label>
          <div class="grid grid-cols-3 gap-3">
            <button type="button" (click)="selectedRole.set('SUPER_ADMIN')"
              class="p-4 rounded-xl border-2 transition-all text-center"
              [ngClass]="selectedRole() === 'SUPER_ADMIN' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
              <div class="text-2xl mb-2">👑</div>
              <p class="font-medium text-secondary-dark text-sm">Super Admin</p>
              <p class="text-xs text-secondary mt-1">Manage system</p>
            </button>
            <button type="button" (click)="selectedRole.set('RESTAURANT_ADMIN')"
              class="p-4 rounded-xl border-2 transition-all text-center"
              [ngClass]="selectedRole() === 'RESTAURANT_ADMIN' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
              <div class="text-2xl mb-2">🍽️</div>
              <p class="font-medium text-secondary-dark text-sm">Restaurant Admin</p>
              <p class="text-xs text-secondary mt-1">Manage restaurants</p>
            </button>
            <button type="button" (click)="selectedRole.set('CUSTOMER')"
              class="p-4 rounded-xl border-2 transition-all text-center"
              [ngClass]="selectedRole() === 'CUSTOMER' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
              <div class="text-2xl mb-2">👤</div>
              <p class="font-medium text-secondary-dark text-sm">Customer</p>
              <p class="text-xs text-secondary mt-1">Browse & book</p>
            </button>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-secondary-dark mb-2">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              [placeholder]="getEmailPlaceholder()"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-dark mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"/>
          </div>
          @if (error) {
            <p class="text-error text-sm">{{ error }}</p>
          }
          <button type="submit" [disabled]="loading"
            class="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign In as ' + getRoleLabel() }}
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-secondary text-sm">
            Don't have an account? 
            <a routerLink="/register" class="text-primary font-medium hover:underline">Create one</a>
          </p>
        </div>
        <p class="text-center text-xs text-secondary mt-4">Demo: Select role and click sign in</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  email = '';
  password = '';
  loading = false;
  error = '';
  selectedRole = signal<'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER'>('RESTAURANT_ADMIN');

  getEmailPlaceholder(): string {
    const placeholders: Record<string, string> = {
      'SUPER_ADMIN': 'superadmin@rmrts.com',
      'RESTAURANT_ADMIN': 'restaurant@rmrts.com',
      'CUSTOMER': 'customer@rmrts.com'
    };
    return placeholders[this.selectedRole()];
  }

  getRoleLabel(): string {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'RESTAURANT_ADMIN': 'Restaurant Admin',
      'CUSTOMER': 'Customer'
    };
    return labels[this.selectedRole()];
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    
    setTimeout(() => {
      this.authService.mockLogin(this.selectedRole());
      const redirectPaths: Record<string, string> = {
        'SUPER_ADMIN': '/super-admin/dashboard',
        'RESTAURANT_ADMIN': '/admin/dashboard',
        'CUSTOMER': '/customer/restaurants'
      };
      this.router.navigate([redirectPaths[this.selectedRole()]]);
      this.loading = false;
    }, 500);
  }
}
