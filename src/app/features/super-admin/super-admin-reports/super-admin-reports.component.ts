import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-super-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div>
              <h1 class="text-2xl font-display font-bold text-secondary-dark">Reports & Analytics</h1>
              <p class="text-secondary text-sm mt-1">System-wide insights and statistics</p>
            </div>

            <!-- Date Range Filter -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4 items-center">
                <span class="text-secondary font-medium">Period:</span>
                <div class="flex gap-2">
                  @for (period of periods; track period.value) {
                    <button (click)="selectedPeriod.set(period.value)"
                      class="px-4 py-2 rounded-lg font-medium transition-all"
                      [ngClass]="selectedPeriod() === period.value ? 'bg-primary text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'">
                      {{ period.label }}
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Overview Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-secondary text-sm">New Users</span>
                  <span class="text-success text-sm font-medium">+{{ stats().userGrowth }}%</span>
                </div>
                <p class="text-3xl font-bold text-secondary-dark">{{ stats().newUsers }}</p>
                <p class="text-sm text-secondary mt-1">vs {{ stats().prevNewUsers }} last period</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-secondary text-sm">New Restaurants</span>
                  <span class="text-success text-sm font-medium">+{{ stats().restaurantGrowth }}%</span>
                </div>
                <p class="text-3xl font-bold text-secondary-dark">{{ stats().newRestaurants }}</p>
                <p class="text-sm text-secondary mt-1">vs {{ stats().prevNewRestaurants }} last period</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-secondary text-sm">Reservations</span>
                  <span class="text-success text-sm font-medium">+{{ stats().reservationGrowth }}%</span>
                </div>
                <p class="text-3xl font-bold text-secondary-dark">{{ stats().reservations }}</p>
                <p class="text-sm text-secondary mt-1">vs {{ stats().prevReservations }} last period</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-secondary text-sm">Reviews</span>
                  <span class="text-success text-sm font-medium">+{{ stats().reviewGrowth }}%</span>
                </div>
                <p class="text-3xl font-bold text-secondary-dark">{{ stats().reviews }}</p>
                <p class="text-sm text-secondary mt-1">vs {{ stats().prevReviews }} last period</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Top Restaurants -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Top Rated Restaurants</h2>
                <div class="space-y-3">
                  @for (r of topRestaurants(); track r.id; let i = $index) {
                    <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">{{ i + 1 }}</span>
                      <div class="flex-1">
                        <p class="font-medium text-secondary-dark">{{ r.name }}</p>
                        <p class="text-sm text-secondary">{{ r.owner }}</p>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span class="font-medium">{{ r.rating }}</span>
                        </div>
                        <p class="text-xs text-secondary">{{ r.reviews }} reviews</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Most Active Admins -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Most Active Restaurant Admins</h2>
                <div class="space-y-3">
                  @for (admin of topAdmins(); track admin.id; let i = $index) {
                    <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span class="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center font-bold text-accent">{{ i + 1 }}</span>
                      <div class="flex-1">
                        <p class="font-medium text-secondary-dark">{{ admin.name }}</p>
                        <p class="text-sm text-secondary">{{ admin.email }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-medium text-secondary-dark">{{ admin.restaurantCount }} restaurants</p>
                        <p class="text-xs text-secondary">{{ admin.totalReservations }} reservations</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Transparency Overview -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-secondary-dark mb-4">System-wide Transparency Scores</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="w-32 h-32 mx-auto relative">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" stroke-width="3" [attr.stroke-dasharray]="transparency().priceFairness + ', 100'"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-secondary-dark">{{ transparency().priceFairness }}%</span>
                    </div>
                  </div>
                  <p class="mt-2 font-medium text-secondary-dark">Price Fairness</p>
                  <p class="text-sm text-secondary">Across all restaurants</p>
                </div>
                <div class="text-center">
                  <div class="w-32 h-32 mx-auto relative">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" stroke-width="3" [attr.stroke-dasharray]="transparency().serviceClarity + ', 100'"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-secondary-dark">{{ transparency().serviceClarity }}%</span>
                    </div>
                  </div>
                  <p class="mt-2 font-medium text-secondary-dark">Service Clarity</p>
                  <p class="text-sm text-secondary">Across all restaurants</p>
                </div>
                <div class="text-center">
                  <div class="w-32 h-32 mx-auto relative">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" stroke-width="3" [attr.stroke-dasharray]="transparency().menuAccuracy + ', 100'"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-secondary-dark">{{ transparency().menuAccuracy }}%</span>
                    </div>
                  </div>
                  <p class="mt-2 font-medium text-secondary-dark">Menu Accuracy</p>
                  <p class="text-sm text-secondary">Across all restaurants</p>
                </div>
              </div>
            </div>

            <!-- Recent Reviews Report -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-secondary-dark mb-4">Recent Review Activity</h2>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 text-left text-sm text-secondary">
                    <tr>
                      <th class="px-4 py-3 font-medium">Restaurant</th>
                      <th class="px-4 py-3 font-medium">Owner</th>
                      <th class="px-4 py-3 font-medium">Reviews</th>
                      <th class="px-4 py-3 font-medium">Avg Score</th>
                      <th class="px-4 py-3 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    @for (r of reviewReport(); track r.id) {
                      <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 font-medium text-secondary-dark">{{ r.restaurant }}</td>
                        <td class="px-4 py-3 text-secondary">{{ r.owner }}</td>
                        <td class="px-4 py-3">{{ r.reviewCount }}</td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            {{ r.avgScore.toFixed(1) }}
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <span class="flex items-center gap-1" [ngClass]="r.trend > 0 ? 'text-success' : r.trend < 0 ? 'text-error' : 'text-secondary'">
                            @if (r.trend > 0) {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                            } @else if (r.trend < 0) {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                            }
                            {{ r.trend > 0 ? '+' : '' }}{{ r.trend }}%
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminReportsComponent {
  periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  selectedPeriod = signal('30d');

  stats = signal({
    newUsers: 156,
    prevNewUsers: 132,
    userGrowth: 18,
    newRestaurants: 12,
    prevNewRestaurants: 9,
    restaurantGrowth: 33,
    reservations: 1247,
    prevReservations: 1089,
    reservationGrowth: 15,
    reviews: 423,
    prevReviews: 367,
    reviewGrowth: 15
  });

  transparency = signal({ priceFairness: 89, serviceClarity: 82, menuAccuracy: 91 });

  topRestaurants = signal([
    { id: '1', name: 'Le Petit Bistro', owner: 'John Smith', rating: 4.9, reviews: 156 },
    { id: '2', name: 'The Golden Fork', owner: 'John Smith', rating: 4.8, reviews: 124 },
    { id: '3', name: 'Sakura Garden', owner: 'Mike Wilson', rating: 4.6, reviews: 89 },
    { id: '4', name: 'Spice Route', owner: 'David Lee', rating: 4.5, reviews: 67 },
    { id: '5', name: 'Casa Mexico', owner: 'David Lee', rating: 4.4, reviews: 78 }
  ]);

  topAdmins = signal([
    { id: '5', name: 'David Lee', email: 'david@cafe.com', restaurantCount: 3, totalReservations: 735 },
    { id: '1', name: 'John Smith', email: 'john@restaurant.com', restaurantCount: 2, totalReservations: 1023 },
    { id: '3', name: 'Mike Wilson', email: 'mike@bistro.com', restaurantCount: 1, totalReservations: 234 }
  ]);

  reviewReport = signal([
    { id: '1', restaurant: 'The Golden Fork', owner: 'John Smith', reviewCount: 45, avgScore: 4.8, trend: 12 },
    { id: '2', restaurant: 'Sakura Garden', owner: 'Mike Wilson', reviewCount: 32, avgScore: 4.6, trend: 8 },
    { id: '3', restaurant: 'Le Petit Bistro', owner: 'John Smith', reviewCount: 56, avgScore: 4.9, trend: 15 },
    { id: '4', restaurant: 'Spice Route', owner: 'David Lee', reviewCount: 23, avgScore: 4.5, trend: -3 },
    { id: '5', restaurant: 'Casa Mexico', owner: 'David Lee', reviewCount: 28, avgScore: 4.4, trend: 5 }
  ]);
}
