import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = inject(ApiService);

  categories = signal<Category[]>([]);
  loading = signal(false);

  getAll(): Observable<Category[]> {
    this.loading.set(true);
    return this.api.get<Category[]>('/categories').pipe(
      tap(data => {
        this.categories.set(data);
        this.loading.set(false);
      })
    );
  }

  getByRestaurant(restaurantId: string): Observable<Category[]> {
    this.loading.set(true);
    return this.api.get<Category[]>(`/categories/restaurant/${restaurantId}`).pipe(
      tap(data => {
        this.categories.set(data);
        this.loading.set(false);
      })
    );
  }

  getActiveByRestaurant(restaurantId: string): Observable<Category[]> {
    return this.api.get<Category[]>(`/categories/restaurant/${restaurantId}/active`);
  }

  getById(id: string): Observable<Category> {
    return this.api.get<Category>(`/categories/${id}`);
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.api.post<Category>('/categories', category).pipe(
      tap(created => this.categories.update(list => [...list, created]))
    );
  }

  update(id: string, category: Partial<Category>): Observable<Category> {
    return this.api.put<Category>(`/categories/${id}`, category).pipe(
      tap(updated => this.categories.update(list => list.map(c => c.id === id ? updated : c)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`).pipe(
      tap(() => this.categories.update(list => list.filter(c => c.id !== id)))
    );
  }
}
