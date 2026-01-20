import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  portionSize: string;
  preparationTime: number;
  calories: number;
  dietaryTags: string[];
  category: 'MAIN_MEAL' | 'DESSERT' | 'DRINKS';
}

export interface CreateMenuItemRequest {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  portionSize?: string;
  preparationTime?: number;
  calories?: number;
  dietaryTags?: string[];
  isAvailable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly apiUrl = `${environment.apiUrl}/menus`;
  
  menuItems = signal<MenuItem[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  getMenuItems(restaurantId?: string): Observable<MenuItem[]> {
    this.loading.set(true);
    const url = restaurantId ? `${this.apiUrl}/items?restaurantId=${restaurantId}` : `${this.apiUrl}/items`;
    return this.http.get<MenuItem[]>(url).pipe(
      tap(items => {
        this.menuItems.set(items);
        this.loading.set(false);
      })
    );
  }

  getMenuItem(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/items/${id}`);
  }

  createMenuItem(request: CreateMenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, request).pipe(
      tap(item => this.menuItems.update(items => [...items, item]))
    );
  }

  updateMenuItem(id: string, request: Partial<CreateMenuItemRequest>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, request).pipe(
      tap(updated => this.menuItems.update(items => items.map(i => i.id === id ? updated : i)))
    );
  }

  toggleAvailability(id: string, isAvailable: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/items/${id}/availability`, { isAvailable }).pipe(
      tap(() => this.menuItems.update(items => items.map(i => i.id === id ? { ...i, isAvailable } : i)))
    );
  }

  deleteMenuItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`).pipe(
      tap(() => this.menuItems.update(items => items.filter(i => i.id !== id)))
    );
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
