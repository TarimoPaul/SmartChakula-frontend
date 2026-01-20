import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { RestaurantServiceItem } from '../models';

@Injectable({ providedIn: 'root' })
export class RestaurantServiceService {
  private api = inject(ApiService);

  services = signal<RestaurantServiceItem[]>([]);
  loading = signal(false);

  getAll(): Observable<RestaurantServiceItem[]> {
    this.loading.set(true);
    return this.api.get<RestaurantServiceItem[]>('/services').pipe(
      tap(data => {
        this.services.set(data);
        this.loading.set(false);
      })
    );
  }

  getByRestaurant(restaurantId: string): Observable<RestaurantServiceItem[]> {
    this.loading.set(true);
    return this.api.get<RestaurantServiceItem[]>(`/services/restaurant/${restaurantId}`).pipe(
      tap(data => {
        this.services.set(data);
        this.loading.set(false);
      })
    );
  }

  getActiveByRestaurant(restaurantId: string): Observable<RestaurantServiceItem[]> {
    return this.api.get<RestaurantServiceItem[]>(`/services/restaurant/${restaurantId}/active`);
  }

  getById(id: string): Observable<RestaurantServiceItem> {
    return this.api.get<RestaurantServiceItem>(`/services/${id}`);
  }

  create(service: Partial<RestaurantServiceItem>): Observable<RestaurantServiceItem> {
    return this.api.post<RestaurantServiceItem>('/services', service).pipe(
      tap(created => this.services.update(list => [...list, created]))
    );
  }

  update(id: string, service: Partial<RestaurantServiceItem>): Observable<RestaurantServiceItem> {
    return this.api.put<RestaurantServiceItem>(`/services/${id}`, service).pipe(
      tap(updated => this.services.update(list => list.map(s => s.id === id ? updated : s)))
    );
  }

  toggleStatus(id: string): Observable<void> {
    return this.api.patch<void>(`/services/${id}/toggle-status`, {}).pipe(
      tap(() => this.services.update(list => list.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/services/${id}`).pipe(
      tap(() => this.services.update(list => list.filter(s => s.id !== id)))
    );
  }
}
