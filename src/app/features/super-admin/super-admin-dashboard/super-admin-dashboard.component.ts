import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div>
              <h1 class="text-2xl font-display font-bold text-secondary-dark">System Dashboard</h1>
              <p class="text-secondary text-sm mt-1">Overview of the entire RMRTS platform</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Total Users</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ stats().totalUsers }}</p>
                  </div>
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                </div>
                <div class="mt-3 flex items-center gap-2 text-sm">
                  <span class="text-success">+12%</span>
                  <span class="text-secondary">from last month</span>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Total Restaurants</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ stats().totalRestaurants }}</p>
                  </div>
                  <div class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                </div>
                <div class="mt-3 flex items-center gap-2 text-sm">
                  <span class="text-success">+8%</span>
                  <span class="text-secondary">from last month</span>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Total Reservations</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ stats().totalReservations }}</p>
                  </div>
                  <div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                </div>
                <div class="mt-3 flex items-center gap-2 text-sm">
                  <span class="text-success">+24%</span>
                  <span class="text-secondary">from last month</span>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-secondary text-sm">Total Reviews</p>
                    <p class="text-3xl font-bold text-secondary-dark mt-1">{{ stats().totalReviews }}</p>
                  </div>
                  <div class="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                  </div>
                </div>
                <div class="mt-3 flex items-center gap-2 text-sm">
                  <span class="text-success">+18%</span>
                  <span class="text-secondary">from last month</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions & User Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Quick Actions -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Quick Actions</h2>
                <div class="space-y-3">
                  <a routerLink="/super-admin/users/new" class="flex items-center gap-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                    </div>
                    <div>
                      <p class="font-medium text-secondary-dark">Create New User</p>
                      <p class="text-xs text-secondary">Add restaurant admin or customer</p>
                    </div>
                  </a>
                  <a routerLink="/super-admin/restaurants/new" class="flex items-center gap-3 p-3 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors">
                    <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </div>
                    <div>
                      <p class="font-medium text-secondary-dark">Add Restaurant</p>
                      <p class="text-xs text-secondary">Register a new restaurant</p>
                    </div>
                  </a>
                  <a routerLink="/super-admin/reports" class="flex items-center gap-3 p-3 bg-success/5 rounded-lg hover:bg-success/10 transition-colors">
                    <div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <p class="font-medium text-secondary-dark">View Reports</p>
                      <p class="text-xs text-secondary">Analytics and insights</p>
                    </div>
                  </a>
                </div>
              </div>

              <!-- User Breakdown -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">User Breakdown</h2>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 bg-primary rounded-full"></div>
                      <span class="text-secondary">Restaurant Admins</span>
                    </div>
                    <span class="font-semibold text-secondary-dark">{{ stats().restaurantAdmins }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 bg-accent rounded-full"></div>
                      <span class="text-secondary">Customers</span>
                    </div>
                    <span class="font-semibold text-secondary-dark">{{ stats().customers }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 bg-warning rounded-full"></div>
                      <span class="text-secondary">Super Admins</span>
                    </div>
                    <span class="font-semibold text-secondary-dark">{{ stats().superAdmins }}</span>
                  </div>
                </div>
                <div class="mt-6 h-4 bg-gray-100 rounded-full overflow-hidden flex">
                  <div class="bg-primary h-full" [style.width.%]="(stats().restaurantAdmins / stats().totalUsers) * 100"></div>
                  <div class="bg-accent h-full" [style.width.%]="(stats().customers / stats().totalUsers) * 100"></div>
                  <div class="bg-warning h-full" [style.width.%]="(stats().superAdmins / stats().totalUsers) * 100"></div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Recent Activity</h2>
                <div class="space-y-4">
                  @for (activity of recentActivity(); track activity.id) {
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        [ngClass]="activity.type === 'user' ? 'bg-primary/10' : activity.type === 'restaurant' ? 'bg-accent/10' : 'bg-success/10'">
                        <span class="text-sm">{{ activity.icon }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-secondary-dark">{{ activity.message }}</p>
                        <p class="text-xs text-secondary">{{ activity.time }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Recent Users & Restaurants -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Recent Users -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-semibold text-secondary-dark">Recent Users</h2>
                  <a routerLink="/super-admin/users" class="text-sm text-primary hover:underline">View All</a>
                </div>
                <div class="space-y-3">
                  @for (user of recentUsers(); track user.id) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span class="font-medium text-primary">{{ user.name.charAt(0) }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-secondary-dark">{{ user.name }}</p>
                          <p class="text-xs text-secondary">{{ user.email }}</p>
                        </div>
                      </div>
                      <span class="px-2 py-1 rounded-full text-xs font-medium"
                        [ngClass]="user.role === 'RESTAURANT_ADMIN' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'">
                        {{ user.role === 'RESTAURANT_ADMIN' ? 'Admin' : 'Customer' }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Recent Restaurants -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-semibold text-secondary-dark">Recent Restaurants</h2>
                  <a routerLink="/super-admin/restaurants" class="text-sm text-primary hover:underline">View All</a>
                </div>
                <div class="space-y-3">
                  @for (restaurant of recentRestaurants(); track restaurant.id) {
                    <a [routerLink]="['/super-admin/restaurants', restaurant.id]" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <span class="text-lg">🍽️</span>
                        </div>
                        <div>
                          <p class="font-medium text-secondary-dark">{{ restaurant.name }}</p>
                          <p class="text-xs text-secondary">{{ restaurant.owner }} • {{ restaurant.region }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span class="text-sm font-medium">{{ restaurant.rating }}</span>
                        </div>
                        <p class="text-xs text-secondary">{{ restaurant.reviews }} reviews</p>
                      </div>
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminDashboardComponent {
  stats = signal({
    totalUsers: 1247,
    totalRestaurants: 86,
    totalReservations: 3542,
    totalReviews: 2891,
    restaurantAdmins: 92,
    customers: 1152,
    superAdmins: 3
  });

  recentActivity = signal([
    { id: '1', type: 'user', icon: '👤', message: 'New restaurant admin registered', time: '5 min ago' },
    { id: '2', type: 'restaurant', icon: '🍽️', message: 'The Golden Fork updated menu', time: '15 min ago' },
    { id: '3', type: 'reservation', icon: '📅', message: '12 new reservations today', time: '1 hour ago' },
    { id: '4', type: 'user', icon: '👤', message: 'New customer signed up', time: '2 hours ago' },
    { id: '5', type: 'restaurant', icon: '🍽️', message: 'Sakura Garden added', time: '3 hours ago' }
  ]);

  recentUsers = signal([
    { id: '1', name: 'John Smith', email: 'john@restaurant.com', role: 'RESTAURANT_ADMIN' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', role: 'CUSTOMER' },
    { id: '3', name: 'Mike Wilson', email: 'mike@bistro.com', role: 'RESTAURANT_ADMIN' },
    { id: '4', name: 'Emily Brown', email: 'emily@email.com', role: 'CUSTOMER' }
  ]);

  recentRestaurants = signal([
    { id: '1', name: 'The Golden Fork', owner: 'John Smith', region: 'Downtown', rating: 4.8, reviews: 124 },
    { id: '2', name: 'Sakura Garden', owner: 'Mike Wilson', region: 'West', rating: 4.6, reviews: 89 },
    { id: '3', name: 'Le Petit Bistro', owner: 'Sarah Lee', region: 'North', rating: 4.9, reviews: 156 }
  ]);
}
