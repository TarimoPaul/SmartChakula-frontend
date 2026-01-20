import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  priceRange: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED';
  formattedAddress: string;
  region: string;
  city: string;
}

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Restaurants</h1>
                <p class="text-secondary text-sm mt-1">Manage your restaurant listings</p>
              </div>
              <a routerLink="/restaurants/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Restaurant
              </a>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search restaurants..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
                <select [(ngModel)]="regionFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Regions</option>
                  <option value="NORTH">North</option>
                  <option value="SOUTH">South</option>
                  <option value="EAST">East</option>
                  <option value="WEST">West</option>
                  <option value="CENTRAL">Central</option>
                  <option value="DOWNTOWN">Downtown</option>
                  <option value="SUBURBAN">Suburban</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (r of filteredRestaurants(); track r.id) {
                <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div class="h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                    <span class="text-4xl">🍽️</span>
                  </div>
                  <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-secondary-dark">{{ r.name }}</h3>
                      <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span>
                    </div>
                    <p class="text-sm text-secondary mb-1">{{ r.cuisineType }} • {{ getPriceLabel(r.priceRange) }}</p>
                    <p class="text-sm text-secondary truncate">{{ r.formattedAddress }}</p>
                    <div class="flex gap-2 mt-4">
                      <a [routerLink]="['/restaurants', r.id]" class="flex-1 px-3 py-2 text-center text-sm border border-gray-200 rounded-lg hover:bg-gray-50">View</a>
                      <a [routerLink]="['/restaurants', r.id, 'edit']" class="flex-1 px-3 py-2 text-center text-sm bg-primary text-white rounded-lg hover:opacity-90">Edit</a>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                  <p class="text-secondary">No restaurants found</p>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class RestaurantListComponent {
  searchQuery = '';
  statusFilter = '';
  regionFilter = '';

  restaurants = signal<Restaurant[]>([
    { id: '1', name: 'The Golden Fork', cuisineType: 'Italian', priceRange: 'PREMIUM', status: 'ACTIVE', formattedAddress: '123 Main St, New York', region: 'DOWNTOWN', city: 'New York' },
    { id: '2', name: 'Sakura Garden', cuisineType: 'Japanese', priceRange: 'MODERATE', status: 'ACTIVE', formattedAddress: '456 Oak Ave, Los Angeles', region: 'WEST', city: 'Los Angeles' },
    { id: '3', name: 'Spice Route', cuisineType: 'Indian', priceRange: 'BUDGET', status: 'PENDING', formattedAddress: '789 Elm St, Chicago', region: 'CENTRAL', city: 'Chicago' },
    { id: '4', name: 'Le Petit Bistro', cuisineType: 'French', priceRange: 'PREMIUM', status: 'ACTIVE', formattedAddress: '321 Pine Rd, San Francisco', region: 'NORTH', city: 'San Francisco' }
  ]);

  filteredRestaurants = signal<Restaurant[]>([]);

  constructor() {
    this.filteredRestaurants.set(this.restaurants());
  }

  applyFilters(): void {
    let result = this.restaurants();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.cuisineType.toLowerCase().includes(q));
    }
    if (this.statusFilter) result = result.filter(r => r.status === this.statusFilter);
    if (this.regionFilter) result = result.filter(r => r.region === this.regionFilter);
    this.filteredRestaurants.set(result);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = { 'ACTIVE': 'bg-success/10 text-success', 'PENDING': 'bg-warning/10 text-warning', 'SUSPENDED': 'bg-error/10 text-error', 'CLOSED': 'bg-gray-100 text-gray-500' };
    return classes[status] || '';
  }

  getPriceLabel(price: string): string {
    const labels: Record<string, string> = { 'BUDGET': '$', 'MODERATE': '$$', 'PREMIUM': '$$$' };
    return labels[price] || '';
  }
}
