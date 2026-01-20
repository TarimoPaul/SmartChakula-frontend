import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  region: string;
  city: string;
  owner: { id: string; name: string; email: string };
  rating: number;
  reviewCount: number;
  reservationCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
}

@Component({
  selector: 'app-super-admin-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">All Restaurants</h1>
                <p class="text-secondary text-sm mt-1">Manage all restaurants in the system</p>
              </div>
              <a routerLink="/super-admin/restaurants/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Restaurant
              </a>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search restaurants..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                <select [(ngModel)]="regionFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Regions</option>
                  <option value="NORTH">North</option>
                  <option value="SOUTH">South</option>
                  <option value="EAST">East</option>
                  <option value="WEST">West</option>
                  <option value="CENTRAL">Central</option>
                  <option value="DOWNTOWN">Downtown</option>
                </select>
                <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            <!-- Restaurants Table -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 text-left text-sm text-secondary">
                  <tr>
                    <th class="px-4 py-3 font-medium">Restaurant</th>
                    <th class="px-4 py-3 font-medium">Owner</th>
                    <th class="px-4 py-3 font-medium">Region</th>
                    <th class="px-4 py-3 font-medium">Rating</th>
                    <th class="px-4 py-3 font-medium">Stats</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (r of filteredRestaurants(); track r.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span class="text-xl">🍽️</span>
                          </div>
                          <div>
                            <a [routerLink]="['/super-admin/restaurants', r.id]" class="font-medium text-secondary-dark hover:text-primary">{{ r.name }}</a>
                            <p class="text-sm text-secondary">{{ r.cuisineType }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <p class="font-medium text-secondary-dark">{{ r.owner.name }}</p>
                        <p class="text-sm text-secondary">{{ r.owner.email }}</p>
                      </td>
                      <td class="px-4 py-3 text-secondary">{{ r.region }}</td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span class="font-medium">{{ r.rating.toFixed(1) }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <p class="text-sm"><span class="font-medium">{{ r.reviewCount }}</span> reviews</p>
                        <p class="text-sm"><span class="font-medium">{{ r.reservationCount }}</span> reservations</p>
                      </td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-1">
                          <a [routerLink]="['/super-admin/restaurants', r.id]" class="p-2 hover:bg-gray-100 rounded-lg" title="View Details">
                            <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </a>
                          @if (r.status === 'ACTIVE') {
                            <button (click)="deactivateRestaurant(r)" class="p-2 hover:bg-error/10 rounded-lg" title="Deactivate">
                              <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                            </button>
                          } @else {
                            <button (click)="activateRestaurant(r)" class="p-2 hover:bg-success/10 rounded-lg" title="Activate">
                              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="px-4 py-12 text-center text-secondary">No restaurants found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminRestaurantsComponent {
  searchQuery = '';
  regionFilter = '';
  statusFilter = '';

  restaurants = signal<Restaurant[]>([
    { id: '1', name: 'The Golden Fork', cuisineType: 'Italian', region: 'DOWNTOWN', city: 'New York', owner: { id: '1', name: 'John Smith', email: 'john@restaurant.com' }, rating: 4.8, reviewCount: 124, reservationCount: 456, status: 'ACTIVE', createdAt: '2024-01-10' },
    { id: '2', name: 'Sakura Garden', cuisineType: 'Japanese', region: 'WEST', city: 'Los Angeles', owner: { id: '3', name: 'Mike Wilson', email: 'mike@bistro.com' }, rating: 4.6, reviewCount: 89, reservationCount: 234, status: 'ACTIVE', createdAt: '2024-01-15' },
    { id: '3', name: 'Le Petit Bistro', cuisineType: 'French', region: 'NORTH', city: 'San Francisco', owner: { id: '1', name: 'John Smith', email: 'john@restaurant.com' }, rating: 4.9, reviewCount: 156, reservationCount: 567, status: 'ACTIVE', createdAt: '2024-01-12' },
    { id: '4', name: 'Spice Route', cuisineType: 'Indian', region: 'CENTRAL', city: 'Chicago', owner: { id: '5', name: 'David Lee', email: 'david@cafe.com' }, rating: 4.5, reviewCount: 67, reservationCount: 189, status: 'INACTIVE', createdAt: '2024-01-18' },
    { id: '5', name: 'Casa Mexico', cuisineType: 'Mexican', region: 'SOUTH', city: 'Houston', owner: { id: '5', name: 'David Lee', email: 'david@cafe.com' }, rating: 4.4, reviewCount: 78, reservationCount: 234, status: 'ACTIVE', createdAt: '2024-01-20' },
    { id: '6', name: 'Dragon Palace', cuisineType: 'Chinese', region: 'EAST', city: 'Boston', owner: { id: '5', name: 'David Lee', email: 'david@cafe.com' }, rating: 4.3, reviewCount: 92, reservationCount: 312, status: 'PENDING', createdAt: '2024-01-22' }
  ]);

  filteredRestaurants = signal<Restaurant[]>([]);

  constructor() {
    this.filteredRestaurants.set(this.restaurants());
  }

  applyFilters(): void {
    let result = this.restaurants();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.owner.name.toLowerCase().includes(q));
    }
    if (this.regionFilter) result = result.filter(r => r.region === this.regionFilter);
    if (this.statusFilter) result = result.filter(r => r.status === this.statusFilter);
    this.filteredRestaurants.set(result);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'ACTIVE': 'bg-success/10 text-success',
      'INACTIVE': 'bg-gray-100 text-gray-500',
      'PENDING': 'bg-warning/10 text-warning'
    };
    return classes[status] || '';
  }

  activateRestaurant(r: Restaurant): void {
    this.restaurants.update(list => list.map(rest => rest.id === r.id ? { ...rest, status: 'ACTIVE' as const } : rest));
    this.applyFilters();
  }

  deactivateRestaurant(r: Restaurant): void {
    if (confirm(`Deactivate "${r.name}"?`)) {
      this.restaurants.update(list => list.map(rest => rest.id === r.id ? { ...rest, status: 'INACTIVE' as const } : rest));
      this.applyFilters();
    }
  }
}
