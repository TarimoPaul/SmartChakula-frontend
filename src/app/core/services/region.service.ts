import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Region } from '../models';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private api = inject(ApiService);

  regions = signal<Region[]>([]);
  loading = signal(false);

  getAll(): Observable<Region[]> {
    this.loading.set(true);
    return this.api.get<Region[]>('/regions').pipe(
      tap(data => {
        this.regions.set(data);
        this.loading.set(false);
      })
    );
  }

  getActive(): Observable<Region[]> {
    return this.api.get<Region[]>('/regions/active');
  }

  getById(id: string): Observable<Region> {
    return this.api.get<Region>(`/regions/${id}`);
  }

  getByCode(code: string): Observable<Region> {
    return this.api.get<Region>(`/regions/code/${code}`);
  }

  create(region: Partial<Region>): Observable<Region> {
    return this.api.post<Region>('/regions', region).pipe(
      tap(created => this.regions.update(list => [...list, created]))
    );
  }

  update(id: string, region: Partial<Region>): Observable<Region> {
    return this.api.put<Region>(`/regions/${id}`, region).pipe(
      tap(updated => this.regions.update(list => list.map(r => r.id === id ? updated : r)))
    );
  }

  toggleStatus(id: string): Observable<void> {
    return this.api.patch<void>(`/regions/${id}/toggle-status`, {}).pipe(
      tap(() => this.regions.update(list => list.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/regions/${id}`).pipe(
      tap(() => this.regions.update(list => list.filter(r => r.id !== id)))
    );
  }
}
