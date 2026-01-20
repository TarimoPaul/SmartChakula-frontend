import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Reservation, CreateReservationRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private api = inject(ApiService);

  reservations = signal<Reservation[]>([]);
  loading = signal(false);

  getAll(params?: Record<string, string>): Observable<PageResponse<Reservation>> {
    this.loading.set(true);
    return this.api.get<PageResponse<Reservation>>('/reservations', params).pipe(
      tap(response => {
        this.reservations.set(response.content);
        this.loading.set(false);
      })
    );
  }

  getByRestaurant(restaurantId: string): Observable<Reservation[]> {
    this.loading.set(true);
    return this.api.get<Reservation[]>(`/reservations/restaurant/${restaurantId}`).pipe(
      tap(data => {
        this.reservations.set(data);
        this.loading.set(false);
      })
    );
  }

  getByRestaurantAndDate(restaurantId: string, date: string): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`/reservations/restaurant/${restaurantId}/date/${date}`);
  }

  getMyReservations(): Observable<Reservation[]> {
    this.loading.set(true);
    return this.api.get<Reservation[]>('/reservations/my').pipe(
      tap(data => {
        this.reservations.set(data);
        this.loading.set(false);
      })
    );
  }

  getById(id: string): Observable<Reservation> {
    return this.api.get<Reservation>(`/reservations/${id}`);
  }

  getByCode(code: string): Observable<Reservation> {
    return this.api.get<Reservation>(`/reservations/code/${code}`);
  }

  create(request: CreateReservationRequest): Observable<Reservation> {
    return this.api.post<Reservation>('/reservations', request).pipe(
      tap(created => this.reservations.update(list => [...list, created]))
    );
  }

  update(id: string, reservation: Partial<Reservation>): Observable<Reservation> {
    return this.api.put<Reservation>(`/reservations/${id}`, reservation).pipe(
      tap(updated => this.reservations.update(list => list.map(r => r.id === id ? updated : r)))
    );
  }

  updateStatus(id: string, status: string): Observable<void> {
    return this.api.patch<void>(`/reservations/${id}/status`, { status }).pipe(
      tap(() => this.reservations.update(list => list.map(r => r.id === id ? { ...r, status: status as Reservation['status'] } : r)))
    );
  }

  cancel(id: string, reason?: string): Observable<void> {
    return this.api.patch<void>(`/reservations/${id}/cancel`, { reason }).pipe(
      tap(() => this.reservations.update(list => list.map(r => r.id === id ? { ...r, status: 'CANCELLED' as const } : r)))
    );
  }
}
