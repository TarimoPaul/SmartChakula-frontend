import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER';
  restaurantIds?: string[]; // Restaurant Admin can manage multiple restaurants
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'rmrts_token';
  private readonly USER_KEY = 'rmrts_user';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(private http: HttpClient, private router: Router) {
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
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
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

  // Mock login for development
  mockLogin(role: 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER' = 'RESTAURANT_ADMIN'): void {
    const users: Record<string, User> = {
      'SUPER_ADMIN': { id: '0', email: 'superadmin@rmrts.com', fullName: 'Super Admin', role: 'SUPER_ADMIN' },
      'RESTAURANT_ADMIN': { id: '1', email: 'restaurant@rmrts.com', fullName: 'Restaurant Admin', role: 'RESTAURANT_ADMIN', restaurantIds: ['1', '2'] },
      'CUSTOMER': { id: '2', email: 'customer@rmrts.com', fullName: 'John Customer', role: 'CUSTOMER' }
    };
    const mockUser = users[role];
    localStorage.setItem(this.TOKEN_KEY, 'mock-token');
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
    this.currentUser.set(mockUser);
    this.isAuthenticated.set(true);
  }

  isSuperAdmin(): boolean {
    return this.currentUser()?.role === 'SUPER_ADMIN';
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
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, {
      ...data,
      role: 'CUSTOMER'
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }
}
