import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  selectedRole = signal<'ADMIN' | 'MANAGER' | 'USER'>('USER');

  selectRole(role: 'ADMIN' | 'MANAGER' | 'USER'): void {
    this.selectedRole.set(role);
    this.error.set('');
  }

  getEmailPlaceholder(): string {
    const role = this.selectedRole();
    if (role === 'ADMIN') return 'admin@example.com';
    if (role === 'MANAGER') return 'manager@example.com';
    return 'user@example.com';
  }

  getPasswordPlaceholder(): string {
    return '••••••••';
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        const role = (response.user.role || '').toUpperCase();
        if (role === 'ADMIN' || role === 'MANAGER') {
          this.router.navigate(['/admin/dashboard']);
          return;
        }
        this.router.navigate(['/customer/restaurants']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message || 'Invalid email or password. Please try again.');
      }
    });
  }
}
