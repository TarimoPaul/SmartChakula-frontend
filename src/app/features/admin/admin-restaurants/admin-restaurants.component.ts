import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaRestaurant } from '../../../core/services/graphql.service';
import { PreviewImageComponent } from './preview-image/preview-image.component';

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  region: string;
  city: string;
  openingTime?: string;
  closingTime?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  reservationCount: number;
  menuItemCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent, HeaderComponent, PreviewImageComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">My Restaurants</h1>
                <p class="text-secondary text-sm mt-1">Manage all your restaurants</p>
              </div>
              <a routerLink="/admin/restaurants/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Restaurant
              </a>
            </div>

            <!-- Restaurant Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (r of restaurants(); track r.id) {
                <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div class="h-32 bg-gradient-to-br from-primary/20 to-accent/20 relative flex items-center justify-center">
                    <span class="text-5xl">🍽️</span>
                    @if (r.image) {
                      <div class="absolute left-4 bottom-0 translate-y-1/2 w-14 h-14 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
                        <app-preview-image [src]="r.image" [alt]="r.name" class="w-full h-full object-contain" />
                      </div>
                    }
                    <div class="absolute top-3 right-3">
                      <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="r.status === 'ACTIVE' ? 'bg-success text-white' : 'bg-gray-400 text-white'">
                        {{ r.status }}
                      </span>
                    </div>
                  </div>
                  <div class="p-5" [class.pt-10]="!!r.image">
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <h3 class="font-semibold text-lg text-secondary-dark">{{ r.name }}</h3>
                        <p class="text-sm text-secondary">{{ r.cuisineType }} • {{ r.region }} • {{ r.city }}</p>
                        @if (r.openingTime || r.closingTime) {
                          <p class="text-xs text-secondary mt-1">{{ r.openingTime || '-' }} - {{ r.closingTime || '-' }}</p>
                        }
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span class="font-medium">{{ r.rating.toFixed(1) }}</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div class="bg-gray-50 rounded-lg p-2">
                        <p class="text-lg font-bold text-secondary-dark">{{ r.menuItemCount }}</p>
                        <p class="text-xs text-secondary">Menu Items</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-2">
                        <p class="text-lg font-bold text-secondary-dark">{{ r.reservationCount }}</p>
                        <p class="text-xs text-secondary">Reservations</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-2">
                        <p class="text-lg font-bold text-secondary-dark">{{ r.reviewCount }}</p>
                        <p class="text-xs text-secondary">Reviews</p>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <a [routerLink]="['/admin/restaurants', r.id, 'edit']" class="flex-1 px-4 py-2 text-center text-sm bg-primary text-white rounded-lg hover:opacity-90">
                        Manage
                      </a>
                      <button (click)="toggleStatus(r)" class="px-4 py-2 text-sm border rounded-lg" 
                        [ngClass]="r.status === 'ACTIVE' ? 'border-error/20 text-error hover:bg-error/5' : 'border-success/20 text-success hover:bg-success/5'">
                        {{ r.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                      </button>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                  <div class="text-5xl mb-4">🍽️</div>
                  <h3 class="text-xl font-semibold text-secondary-dark mb-2">No restaurants yet</h3>
                  <p class="text-secondary mb-4">Add your first restaurant to get started</p>
                  <a routerLink="/admin/restaurants/new" class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90">
                    Add Restaurant
                  </a>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminRestaurantsComponent {
  private graphql = inject(GraphQLService);

  restaurants = signal<Restaurant[]>([]);

  ngOnInit(): void {
    this.graphql.getSmartCakulaRestaurants().subscribe({
      next: (list) => {
        this.restaurants.set(list.map(r => this.mapFromSmartCakula(r)));
      },
      error: () => {
        this.restaurants.set([]);
      }
    });
  }

  private mapFromSmartCakula(r: SmartCakulaRestaurant): Restaurant {
    return {
      id: r.uid,
      name: r.name,
      cuisineType: r.type || '-',
      region: r.region || '-',
      city: r.city || '-',
      openingTime: r.openingTime || undefined,
      closingTime: r.closingTime || undefined,
      image: r.image || undefined,
      rating: 0,
      reviewCount: 0,
      reservationCount: 0,
      menuItemCount: 0,
      status: (r.isOpen && r.isOpen.toLowerCase() === 'false') ? 'INACTIVE' : 'ACTIVE'
    };
  }

  toggleStatus(r: Restaurant): void {
    const newStatus = r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.restaurants.update(list => list.map(rest => rest.id === r.id ? { ...rest, status: newStatus as 'ACTIVE' | 'INACTIVE' } : rest));
  }
}
