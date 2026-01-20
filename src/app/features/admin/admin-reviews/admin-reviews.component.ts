import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models';

interface ReviewDisplay extends Review {
  customerName?: string;
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div>
              <h1 class="text-2xl font-display font-bold text-secondary-dark">Customer Reviews</h1>
              <p class="text-secondary text-sm mt-1">Transparency-based feedback from your customers</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Total Reviews</p>
                <p class="text-2xl font-bold text-secondary-dark">{{ reviews().length }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Price Fairness</p>
                <div class="flex items-center gap-2">
                  <p class="text-2xl font-bold text-success">{{ getPositivePercent('priceFairness') }}%</p>
                  <span class="text-lg">👍</span>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Service Clarity</p>
                <div class="flex items-center gap-2">
                  <p class="text-2xl font-bold text-success">{{ getPositivePercent('serviceClarity') }}%</p>
                  <span class="text-lg">👍</span>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Menu Accuracy</p>
                <div class="flex items-center gap-2">
                  <p class="text-2xl font-bold text-success">{{ getPositivePercent('menuAccuracy') }}%</p>
                  <span class="text-lg">👍</span>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <select [(ngModel)]="verifiedFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Reviews</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified</option>
                </select>
                <select [(ngModel)]="ratingFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Ratings</option>
                  <option value="positive">Mostly Positive</option>
                  <option value="negative">Has Negative</option>
                </select>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="space-y-4">
              @for (review of filteredReviews(); track review.id) {
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span class="text-primary font-medium">{{ (review.customerName || 'A').charAt(0) }}</span>
                      </div>
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
                        <p class="text-sm text-secondary">{{ review.createdAt }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div class="text-center">
                      <p class="text-sm text-secondary mb-1">Price Fairness</p>
                      <span class="text-2xl">{{ review.priceFairness ? '👍' : '👎' }}</span>
                    </div>
                    <div class="text-center">
                      <p class="text-sm text-secondary mb-1">Service Clarity</p>
                      <span class="text-2xl">{{ review.serviceClarity ? '👍' : '👎' }}</span>
                    </div>
                    <div class="text-center">
                      <p class="text-sm text-secondary mb-1">Menu Accuracy</p>
                      <span class="text-2xl">{{ review.menuAccuracy ? '👍' : '👎' }}</span>
                    </div>
                  </div>

                  @if (review.comment) {
                    <p class="text-secondary-dark italic">"{{ review.comment }}"</p>
                  }
                </div>
              } @empty {
                <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div class="text-4xl mb-4">⭐</div>
                  <p class="text-secondary">No reviews match your filters</p>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  
  verifiedFilter = '';
  ratingFilter = '';
  loading = signal(false);

  reviews = signal<ReviewDisplay[]>([]);
  filteredReviews = signal<ReviewDisplay[]>([]);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    this.reviewService.getAll().subscribe({
      next: (response) => {
        const mapped = response.content.map(r => ({
          ...r,
          customerName: r.user?.fullName || 'Anonymous'
        }));
        this.reviews.set(mapped);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    let result = this.reviews();
    if (this.verifiedFilter) {
      result = result.filter(r => r.isVerified === (this.verifiedFilter === 'true'));
    }
    if (this.ratingFilter === 'positive') {
      result = result.filter(r => r.priceFairness && r.serviceClarity && r.menuAccuracy);
    } else if (this.ratingFilter === 'negative') {
      result = result.filter(r => !r.priceFairness || !r.serviceClarity || !r.menuAccuracy);
    }
    this.filteredReviews.set(result);
  }

  getPositivePercent(field: 'priceFairness' | 'serviceClarity' | 'menuAccuracy'): number {
    const total = this.reviews().length;
    if (total === 0) return 0;
    const positive = this.reviews().filter(r => r[field]).length;
    return Math.round((positive / total) * 100);
  }
}
