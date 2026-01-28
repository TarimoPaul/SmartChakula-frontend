import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';
import { GraphQLService } from './graphql.service';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'rmrts_token';
  private readonly USER_KEY = 'rmrts_user';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(private graphql: GraphQLService, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    if (token && userJson) {
      this.currentUser.set(JSON.parse(userJson));
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // SmartCakula-backend expects LoginInput { identifier, password }
    return this.graphql.login(email, password).pipe(
      tap((response) => {
        // SmartCakula returns: { token, user }
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  isSystemAdmin(): boolean {
    return this.currentUser()?.role === 'SYSTEM_ADMIN';
  }

  isRestaurantAdmin(): boolean {
    return this.currentUser()?.role === 'RESTAURANT_ADMIN';
  }

  isCustomer(): boolean {
    return this.currentUser()?.role === 'CUSTOMER';
  }

  // Mock registration for development
  mockRegister(data: { fullName: string; email: string; phone?: string; password: string }): void {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      fullName: data.fullName,
      role: 'CUSTOMER'
    };
    console.log('Registered new user:', newUser);
  }

  register(data: { fullName: string; email: string; phone?: string; password: string }): Observable<LoginResponse> {
    // SmartCakula-backend currently exposes only login via GraphQL (no register mutation in schema).
    // Keep method signature; if you add register to SmartCakula schema later, we can switch this too.
    return throwError(() => new Error('Register via GraphQL is not available in SmartCakula-backend schema yet.'));
  }
}
