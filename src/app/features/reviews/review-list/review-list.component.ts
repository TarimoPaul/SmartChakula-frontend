import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Review { id: string; customerName: string; restaurantName: string; priceFairness: boolean; serviceClarity: boolean; menuAccuracy: boolean; comment: string; isVerified: boolean; createdAt: string; }

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Reviews</h1>
                <p class="text-secondary text-sm mt-1">Transparency-based review system</p>
              </div>
              <a routerLink="/reviews/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Write Review
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Total Reviews</p><p class="text-2xl font-bold text-secondary-dark">{{ reviews().length }}</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Price Fairness</p><p class="text-2xl font-bold text-success">{{ getPositivePercent('priceFairness') }}%</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Service Clarity</p><p class="text-2xl font-bold text-success">{{ getPositivePercent('serviceClarity') }}%</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Menu Accuracy</p><p class="text-2xl font-bold text-success">{{ getPositivePercent('menuAccuracy') }}%</p></div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <select [(ngModel)]="restaurantFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Restaurants</option>
                  <option value="The Golden Fork">The Golden Fork</option>
                  <option value="Sakura Garden">Sakura Garden</option>
                  <option value="Spice Route">Spice Route</option>
                </select>
                <select [(ngModel)]="verifiedFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Reviews</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              @for (review of filteredReviews(); track review.id) {
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-semibold text-secondary-dark">{{ review.customerName }}</h3>
                        @if (review.isVerified) {
                          <span class="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full flex items-center gap-1">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                            Verified
                          </span>
                        }
                      </div>
                      <p class="text-sm text-secondary">{{ review.restaurantName }} • {{ review.createdAt }}</p>
                    </div>
                  </div>
                  <div class="flex gap-6 mb-4">
                    <div class="flex items-center gap-2"><span class="text-sm text-secondary">Price Fairness:</span><span class="text-lg">{{ review.priceFairness ? '👍' : '👎' }}</span></div>
                    <div class="flex items-center gap-2"><span class="text-sm text-secondary">Service Clarity:</span><span class="text-lg">{{ review.serviceClarity ? '👍' : '👎' }}</span></div>
                    <div class="flex items-center gap-2"><span class="text-sm text-secondary">Menu Accuracy:</span><span class="text-lg">{{ review.menuAccuracy ? '👍' : '👎' }}</span></div>
                  </div>
                  @if (review.comment) {
                    <p class="text-secondary-dark bg-gray-50 p-3 rounded-lg">"{{ review.comment }}"</p>
                  }
                </div>
              } @empty {
                <div class="bg-white rounded-xl shadow-sm p-12 text-center"><p class="text-secondary">No reviews found</p></div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ReviewListComponent {
  restaurantFilter = '';
  verifiedFilter = '';

  reviews = signal<Review[]>([
    { id: '1', customerName: 'John S.', restaurantName: 'The Golden Fork', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Excellent experience! Prices matched the menu exactly.', isVerified: true, createdAt: '2024-01-20' },
    { id: '2', customerName: 'Sarah J.', restaurantName: 'Sakura Garden', priceFairness: true, serviceClarity: false, menuAccuracy: true, comment: 'Food was great but service fees were not clearly explained.', isVerified: true, createdAt: '2024-01-19' },
    { id: '3', customerName: 'Mike W.', restaurantName: 'The Golden Fork', priceFairness: false, serviceClarity: true, menuAccuracy: true, comment: 'Portion sizes smaller than expected for the price.', isVerified: false, createdAt: '2024-01-18' },
    { id: '4', customerName: 'Emily B.', restaurantName: 'Spice Route', priceFairness: true, serviceClarity: true, menuAccuracy: false, comment: 'Some items on the menu were not available.', isVerified: true, createdAt: '2024-01-17' }
  ]);

  filteredReviews = signal<Review[]>([]);

  constructor() { this.filteredReviews.set(this.reviews()); }

  applyFilters(): void {
    let result = this.reviews();
    if (this.restaurantFilter) result = result.filter(r => r.restaurantName === this.restaurantFilter);
    if (this.verifiedFilter) result = result.filter(r => r.isVerified === (this.verifiedFilter === 'true'));
    this.filteredReviews.set(result);
  }

  getPositivePercent(field: 'priceFairness' | 'serviceClarity' | 'menuAccuracy'): number {
    const total = this.reviews().length;
    if (total === 0) return 0;
    const positive = this.reviews().filter(r => r[field]).length;
    return Math.round((positive / total) * 100);
  }
}
