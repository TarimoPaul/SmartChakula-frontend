import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Review, ReviewStats, CreateReviewRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = inject(ApiService);

  reviews = signal<Review[]>([]);
  loading = signal(false);

  getAll(params?: Record<string, string>): Observable<PageResponse<Review>> {
    this.loading.set(true);
    return this.api.get<PageResponse<Review>>('/reviews', params).pipe(
      tap(response => {
        this.reviews.set(response.content);
        this.loading.set(false);
      })
    );
  }

  getByRestaurant(restaurantId: string): Observable<Review[]> {
    this.loading.set(true);
    return this.api.get<Review[]>(`/reviews/restaurant/${restaurantId}`).pipe(
      tap(data => {
        this.reviews.set(data);
        this.loading.set(false);
      })
    );
  }

  getByRestaurantPaged(restaurantId: string, params?: Record<string, string>): Observable<PageResponse<Review>> {
    return this.api.get<PageResponse<Review>>(`/reviews/restaurant/${restaurantId}/paged`, params);
  }

  getRestaurantStats(restaurantId: string): Observable<ReviewStats> {
    return this.api.get<ReviewStats>(`/reviews/restaurant/${restaurantId}/stats`);
  }

  getById(id: string): Observable<Review> {
    return this.api.get<Review>(`/reviews/${id}`);
  }

  create(request: CreateReviewRequest): Observable<Review> {
    return this.api.post<Review>('/reviews', request).pipe(
      tap(created => this.reviews.update(list => [...list, created]))
    );
  }

  update(id: string, review: Partial<Review>): Observable<Review> {
    return this.api.put<Review>(`/reviews/${id}`, review).pipe(
      tap(updated => this.reviews.update(list => list.map(r => r.id === id ? updated : r)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/reviews/${id}`).pipe(
      tap(() => this.reviews.update(list => list.filter(r => r.id !== id)))
    );
  }
}
