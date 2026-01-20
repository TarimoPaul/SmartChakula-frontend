import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <a routerLink="/restaurants" class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </a>
                <div>
                  <h1 class="text-2xl font-display font-bold text-secondary-dark">{{ restaurant().name }}</h1>
                  <p class="text-secondary text-sm">{{ restaurant().cuisineType }} Restaurant</p>
                </div>
              </div>
              <div class="flex gap-2">
                <a [routerLink]="['/restaurants', restaurant().id, 'edit']" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Edit
                </a>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="lg:col-span-2 space-y-6">
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div class="h-48 bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
                    <span class="text-6xl">🍽️</span>
                  </div>
                  <div class="p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <span class="px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">{{ restaurant().status }}</span>
                      <span class="text-secondary">•</span>
                      <span class="text-secondary">{{ getPriceLabel(restaurant().priceRange) }}</span>
                    </div>
                    <p class="text-secondary">{{ restaurant().description }}</p>
                  </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6">
                  <h2 class="text-lg font-semibold text-secondary-dark mb-4">Contact Information</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-start gap-3">
                      <div class="p-2 bg-primary/10 rounded-lg">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                      </div>
                      <div>
                        <p class="text-sm text-secondary">Address</p>
                        <p class="font-medium text-secondary-dark">{{ restaurant().formattedAddress }}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="p-2 bg-primary/10 rounded-lg">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <div>
                        <p class="text-sm text-secondary">Phone</p>
                        <p class="font-medium text-secondary-dark">{{ restaurant().phone }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <h2 class="text-lg font-semibold text-secondary-dark mb-4">Quick Stats</h2>
                  <div class="space-y-4">
                    <div class="flex justify-between"><span class="text-secondary">Reservations</span><span class="font-semibold">24</span></div>
                    <div class="flex justify-between"><span class="text-secondary">Menu Items</span><span class="font-semibold">45</span></div>
                    <div class="flex justify-between"><span class="text-secondary">Reviews</span><span class="font-semibold">18</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  restaurant = signal({
    id: '1', name: 'The Golden Fork', cuisineType: 'Italian', priceRange: 'PREMIUM', status: 'ACTIVE',
    description: 'Experience the finest Italian cuisine in an elegant setting.',
    formattedAddress: '123 Main Street, New York, NY 10001', phone: '+1 (555) 123-4567'
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  }

  getPriceLabel(price: string): string {
    const labels: Record<string, string> = { 'BUDGET': '$ Budget', 'MODERATE': '$$ Moderate', 'PREMIUM': '$$$ Premium' };
    return labels[price] || '';
  }
}
