import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Restaurant, WorkingHours, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private api = inject(ApiService);

  restaurants = signal<Restaurant[]>([]);
  loading = signal(false);

  getAll(params?: Record<string, string>): Observable<PageResponse<Restaurant>> {
    this.loading.set(true);
    return this.api.get<PageResponse<Restaurant>>('/restaurants', params).pipe(
      tap(response => {
        this.restaurants.set(response.content);
        this.loading.set(false);
      })
    );
  }

  getById(id: string): Observable<Restaurant> {
    return this.api.get<Restaurant>(`/restaurants/${id}`);
  }

  getBySlug(slug: string): Observable<Restaurant> {
    return this.api.get<Restaurant>(`/restaurants/slug/${slug}`);
  }

  create(restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.api.post<Restaurant>('/restaurants', restaurant).pipe(
      tap(created => this.restaurants.update(list => [...list, created]))
    );
  }

  update(id: string, restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.api.put<Restaurant>(`/restaurants/${id}`, restaurant).pipe(
      tap(updated => this.restaurants.update(list => list.map(r => r.id === id ? updated : r)))
    );
  }

  updateStatus(id: string, status: string): Observable<void> {
    return this.api.patch<void>(`/restaurants/${id}/status`, { status }).pipe(
      tap(() => this.restaurants.update(list => list.map(r => r.id === id ? { ...r, status: status as Restaurant['status'] } : r)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/restaurants/${id}`).pipe(
      tap(() => this.restaurants.update(list => list.filter(r => r.id !== id)))
    );
  }

  getWorkingHours(restaurantId: string): Observable<WorkingHours[]> {
    return this.api.get<WorkingHours[]>(`/restaurants/${restaurantId}/working-hours`);
  }

  updateWorkingHours(restaurantId: string, hours: WorkingHours[]): Observable<WorkingHours[]> {
    return this.api.put<WorkingHours[]>(`/restaurants/${restaurantId}/working-hours`, hours);
  }
}
