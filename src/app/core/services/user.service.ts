import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  users = signal<User[]>([]);
  loading = signal(false);

  getAll(params?: Record<string, string>): Observable<PageResponse<User>> {
    this.loading.set(true);
    return this.api.get<PageResponse<User>>('/users', params).pipe(
      tap(response => {
        this.users.set(response.content);
        this.loading.set(false);
      })
    );
  }

  getById(id: string): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  create(user: { email: string; password: string; fullName: string; phone?: string; role: string }): Observable<User> {
    return this.api.post<User>('/users', user).pipe(
      tap(created => this.users.update(list => [...list, created]))
    );
  }

  update(id: string, user: Partial<User>): Observable<User> {
    return this.api.put<User>(`/users/${id}`, user).pipe(
      tap(updated => this.users.update(list => list.map(u => u.id === id ? updated : u)))
    );
  }

  updateStatus(id: string, isActive: boolean): Observable<void> {
    return this.api.patch<void>(`/users/${id}/status`, { isActive }).pipe(
      tap(() => this.users.update(list => list.map(u => u.id === id ? { ...u, isActive } : u)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/users/${id}`).pipe(
      tap(() => this.users.update(list => list.filter(u => u.id !== id)))
    );
  }
}
