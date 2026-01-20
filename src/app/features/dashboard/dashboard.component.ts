import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <h1 class="text-2xl font-display font-bold text-secondary-dark">Dashboard</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (stat of stats; track stat.label) {
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-secondary text-sm">{{ stat.label }}</p>
                      <p class="text-2xl font-bold mt-1" [class]="stat.color">{{ stat.value }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" [class]="stat.bgColor">
                      <span [innerHTML]="stat.icon"></span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Recent Reservations</h2>
                <div class="space-y-3">
                  @for (r of recentReservations; track r.code) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p class="font-medium text-secondary-dark">{{ r.name }}</p>
                        <p class="text-sm text-secondary">{{ r.restaurant }} • {{ r.time }}</p>
                      </div>
                      <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Quick Actions</h2>
                <div class="grid grid-cols-2 gap-3">
                  <a routerLink="/restaurants/new" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <span class="text-2xl">🏪</span>
                    <p class="text-sm font-medium mt-2">Add Restaurant</p>
                  </a>
                  <a routerLink="/menus" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <span class="text-2xl">📋</span>
                    <p class="text-sm font-medium mt-2">Manage Menus</p>
                  </a>
                  <a routerLink="/reservations" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <span class="text-2xl">📅</span>
                    <p class="text-sm font-medium mt-2">View Bookings</p>
                  </a>
                  <a routerLink="/reviews" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <span class="text-2xl">⭐</span>
                    <p class="text-sm font-medium mt-2">Read Reviews</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats = [
    { label: 'Total Restaurants', value: '12', color: 'text-secondary-dark', bgColor: 'bg-primary/10', icon: '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
    { label: 'Today Reservations', value: '28', color: 'text-success', bgColor: 'bg-success/10', icon: '<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { label: 'Pending Reviews', value: '5', color: 'text-warning', bgColor: 'bg-warning/10', icon: '<svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>' },
    { label: 'Menu Items', value: '156', color: 'text-primary', bgColor: 'bg-accent/10', icon: '<svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' }
  ];

  recentReservations = [
    { code: 'RES-001', name: 'John Smith', restaurant: 'The Golden Fork', time: '7:00 PM', status: 'CONFIRMED' },
    { code: 'RES-002', name: 'Sarah Johnson', restaurant: 'Sakura Garden', time: '8:30 PM', status: 'PENDING' },
    { code: 'RES-003', name: 'Mike Wilson', restaurant: 'Spice Route', time: '6:00 PM', status: 'COMPLETED' }
  ];

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-warning/10 text-warning',
      'CONFIRMED': 'bg-success/10 text-success',
      'COMPLETED': 'bg-primary/10 text-primary',
      'CANCELLED': 'bg-error/10 text-error'
    };
    return classes[status] || '';
  }
}
