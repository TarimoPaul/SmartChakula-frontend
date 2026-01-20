import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Reservation {
  id: string;
  confirmationCode: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

interface Review {
  id: string;
  customerName: string;
  priceFairness: boolean;
  serviceClarity: boolean;
  menuAccuracy: boolean;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div>
              <h1 class="text-2xl font-display font-bold text-secondary-dark">Restaurant Dashboard</h1>
              <p class="text-secondary text-sm mt-1">Overview of your restaurant performance</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Today's Reservations</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ todayReservations().length }}</p>
                  </div>
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span class="text-2xl">📅</span>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Pending Confirmations</p>
                    <p class="text-3xl font-bold text-warning mt-1">{{ getPendingCount() }}</p>
                  </div>
                  <div class="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <span class="text-2xl">⏳</span>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Total Reviews</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ reviews().length }}</p>
                  </div>
                  <div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span class="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Transparency Score</p>
                    <p class="text-3xl font-bold text-success mt-1">{{ getTransparencyScore() }}%</p>
                  </div>
                  <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <span class="text-2xl">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Upcoming Reservations -->
              <div class="bg-white rounded-xl shadow-sm">
                <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 class="font-semibold text-secondary-dark">Upcoming Reservations</h2>
                  <a routerLink="/admin/reservations" class="text-sm text-primary hover:underline">View All</a>
                </div>
                <div class="divide-y divide-gray-100">
                  @for (r of upcomingReservations(); track r.id) {
                    <div class="p-4 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span class="text-primary font-medium">{{ r.customerName.charAt(0) }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-secondary-dark">{{ r.customerName }}</p>
                          <p class="text-sm text-secondary">{{ r.date }} at {{ r.time }} • {{ r.partySize }} guests</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span>
                        @if (r.status === 'PENDING') {
                          <button (click)="confirmReservation(r)" class="p-2 hover:bg-success/10 rounded-lg" title="Confirm">
                            <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                          </button>
                        }
                      </div>
                    </div>
                  } @empty {
                    <div class="p-8 text-center text-secondary">No upcoming reservations</div>
                  }
                </div>
              </div>

              <!-- Recent Reviews -->
              <div class="bg-white rounded-xl shadow-sm">
                <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 class="font-semibold text-secondary-dark">Recent Reviews</h2>
                  <a routerLink="/admin/reviews" class="text-sm text-primary hover:underline">View All</a>
                </div>
                <div class="divide-y divide-gray-100">
                  @for (review of recentReviews(); track review.id) {
                    <div class="p-4">
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-secondary-dark">{{ review.customerName }}</span>
                          @if (review.isVerified) {
                            <span class="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">Verified</span>
                          }
                        </div>
                        <span class="text-xs text-secondary">{{ review.createdAt }}</span>
                      </div>
                      <div class="flex gap-4 mb-2">
                        <span class="text-sm">Price: {{ review.priceFairness ? '👍' : '👎' }}</span>
                        <span class="text-sm">Service: {{ review.serviceClarity ? '👍' : '👎' }}</span>
                        <span class="text-sm">Menu: {{ review.menuAccuracy ? '👍' : '👎' }}</span>
                      </div>
                      @if (review.comment) {
                        <p class="text-sm text-secondary italic">"{{ review.comment }}"</p>
                      }
                    </div>
                  } @empty {
                    <div class="p-8 text-center text-secondary">No reviews yet</div>
                  }
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="font-semibold text-secondary-dark mb-4">Quick Actions</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a routerLink="/admin/restaurant/edit" class="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <div class="text-2xl mb-2">🏪</div>
                  <p class="font-medium text-secondary-dark">Edit Restaurant</p>
                </a>
                <a routerLink="/admin/categories" class="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <div class="text-2xl mb-2">📂</div>
                  <p class="font-medium text-secondary-dark">Manage Categories</p>
                </a>
                <a routerLink="/admin/menu" class="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <div class="text-2xl mb-2">🍽️</div>
                  <p class="font-medium text-secondary-dark">Edit Menu</p>
                </a>
                <a routerLink="/admin/reservations" class="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <div class="text-2xl mb-2">📅</div>
                  <p class="font-medium text-secondary-dark">View Reservations</p>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  reservations = signal<Reservation[]>([
    { id: '1', confirmationCode: 'RES-A1B2C3', customerName: 'John Smith', date: '2024-01-25', time: '19:00', partySize: 4, status: 'CONFIRMED' },
    { id: '2', confirmationCode: 'RES-D4E5F6', customerName: 'Sarah Johnson', date: '2024-01-25', time: '20:30', partySize: 2, status: 'PENDING' },
    { id: '3', confirmationCode: 'RES-G7H8I9', customerName: 'Mike Wilson', date: '2024-01-26', time: '18:00', partySize: 6, status: 'PENDING' },
    { id: '4', confirmationCode: 'RES-J0K1L2', customerName: 'Emily Brown', date: '2024-01-26', time: '19:30', partySize: 3, status: 'CONFIRMED' }
  ]);

  reviews = signal<Review[]>([
    { id: '1', customerName: 'John S.', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Excellent experience!', isVerified: true, createdAt: '2024-01-20' },
    { id: '2', customerName: 'Sarah J.', priceFairness: true, serviceClarity: false, menuAccuracy: true, comment: 'Food was great but fees unclear.', isVerified: true, createdAt: '2024-01-19' },
    { id: '3', customerName: 'Mike W.', priceFairness: false, serviceClarity: true, menuAccuracy: true, comment: 'Portions smaller than expected.', isVerified: false, createdAt: '2024-01-18' }
  ]);

  todayReservations = signal<Reservation[]>([]);
  upcomingReservations = signal<Reservation[]>([]);
  recentReviews = signal<Review[]>([]);

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    this.todayReservations.set(this.reservations().filter(r => r.date === today));
    this.upcomingReservations.set(this.reservations().slice(0, 4));
    this.recentReviews.set(this.reviews().slice(0, 3));
  }

  getPendingCount(): number {
    return this.reservations().filter(r => r.status === 'PENDING').length;
  }

  getTransparencyScore(): number {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    const positiveCount = reviews.reduce((acc, r) => {
      return acc + (r.priceFairness ? 1 : 0) + (r.serviceClarity ? 1 : 0) + (r.menuAccuracy ? 1 : 0);
    }, 0);
    return Math.round((positiveCount / (reviews.length * 3)) * 100);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-warning/10 text-warning',
      'CONFIRMED': 'bg-success/10 text-success',
      'COMPLETED': 'bg-primary/10 text-primary',
      'CANCELLED': 'bg-error/10 text-error'
    };
    return classes[status] || '';
  }

  confirmReservation(r: Reservation): void {
    this.reservations.update(list => list.map(res => res.id === r.id ? { ...res, status: 'CONFIRMED' as const } : res));
    this.upcomingReservations.set(this.reservations().slice(0, 4));
  }
}
