import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-display font-bold text-primary mb-2">RMRTS</h1>
          <p class="text-secondary">Restaurant Menu & Reservation Transparency System</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-display font-bold text-secondary-dark">Create Account</h2>
            <p class="text-secondary text-sm mt-1">Join us to discover and book restaurants</p>
          </div>

          @if (error()) {
            <div class="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {{ error() }}
            </div>
          }

          @if (success()) {
            <div class="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
              {{ success() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-secondary-dark mb-1">First Name *</label>
                <input type="text" formControlName="firstName" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="John"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-dark mb-1">Last Name *</label>
                <input type="text" formControlName="lastName" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Doe"/>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Email Address *</label>
              <input type="email" formControlName="email" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="john@example.com"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Phone Number</label>
              <input type="tel" formControlName="phone" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+1 555-0000"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Password *</label>
              <div class="relative">
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  placeholder="Min. 8 characters"/>
                <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-secondary-dark">
                  @if (showPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
              @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
                <p class="text-error text-xs mt-1">Password must be at least 8 characters</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Confirm Password *</label>
              <input [type]="showPassword() ? 'text' : 'password'" formControlName="confirmPassword" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirm your password"/>
              @if (form.get('confirmPassword')?.touched && form.errors?.['passwordMismatch']) {
                <p class="text-error text-xs mt-1">Passwords do not match</p>
              }
            </div>

            <div class="flex items-start gap-2">
              <input type="checkbox" formControlName="agreeTerms" id="agreeTerms" class="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"/>
              <label for="agreeTerms" class="text-sm text-secondary">
                I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" [disabled]="form.invalid || loading()"
              class="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (loading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Creating account...
              } @else {
                Create Account
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-secondary text-sm">
              Already have an account? 
              <a routerLink="/login" class="text-primary font-medium hover:underline">Sign in</a>
            </p>
          </div>
        </div>

        <p class="text-center text-secondary text-sm mt-6">
          &copy; 2024 RMRTS. All rights reserved.
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  success = signal('');
  showPassword = signal(false);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    agreeTerms: [false, Validators.requiredTrue]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const { firstName, lastName, email, phone, password } = this.form.value;

    // Mock registration - in production, call authService.register()
    setTimeout(() => {
      // Simulate successful registration
      this.authService.mockRegister({
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        password
      });

      this.success.set('Account created successfully! Redirecting to login...');
      this.loading.set(false);

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 1000);
  }
}
