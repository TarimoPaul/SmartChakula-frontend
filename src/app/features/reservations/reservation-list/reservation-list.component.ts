import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Reservation { id: string; confirmationCode: string; customerName: string; customerPhone: string; restaurantName: string; date: string; time: string; partySize: number; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; }

@Component({
  selector: 'app-reservation-list',
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
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Reservations</h1>
                <p class="text-secondary text-sm mt-1">Manage restaurant bookings</p>
              </div>
              <a routerLink="/reservations/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Book Table
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Today</p><p class="text-2xl font-bold text-secondary-dark">{{ getTodayCount() }}</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Pending</p><p class="text-2xl font-bold text-warning">{{ getCountByStatus('PENDING') }}</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Confirmed</p><p class="text-2xl font-bold text-success">{{ getCountByStatus('CONFIRMED') }}</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Completed</p><p class="text-2xl font-bold text-primary">{{ getCountByStatus('COMPLETED') }}</p></div>
              <div class="bg-white rounded-xl shadow-sm p-4"><p class="text-secondary text-sm">Cancelled</p><p class="text-2xl font-bold text-error">{{ getCountByStatus('CANCELLED') }}</p></div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <input type="date" [(ngModel)]="dateFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 text-left text-sm text-secondary">
                  <tr>
                    <th class="px-4 py-3 font-medium">Code</th>
                    <th class="px-4 py-3 font-medium">Customer</th>
                    <th class="px-4 py-3 font-medium">Restaurant</th>
                    <th class="px-4 py-3 font-medium">Date & Time</th>
                    <th class="px-4 py-3 font-medium">Party</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (r of filteredReservations(); track r.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3 font-mono text-sm font-medium text-primary">{{ r.confirmationCode }}</td>
                      <td class="px-4 py-3"><p class="font-medium text-secondary-dark">{{ r.customerName }}</p><p class="text-sm text-secondary">{{ r.customerPhone }}</p></td>
                      <td class="px-4 py-3 text-secondary-dark">{{ r.restaurantName }}</td>
                      <td class="px-4 py-3"><p class="font-medium text-secondary-dark">{{ r.date }}</p><p class="text-sm text-secondary">{{ r.time }}</p></td>
                      <td class="px-4 py-3 font-medium">{{ r.partySize }}</td>
                      <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span></td>
                      <td class="px-4 py-3 text-right">
                        @if (r.status === 'PENDING') {
                          <button (click)="updateStatus(r, 'CONFIRMED')" class="p-2 hover:bg-success/10 rounded-lg" title="Confirm"><svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></button>
                        }
                        @if (r.status !== 'CANCELLED' && r.status !== 'COMPLETED') {
                          <button (click)="updateStatus(r, 'CANCELLED')" class="p-2 hover:bg-error/10 rounded-lg" title="Cancel"><svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="px-4 py-12 text-center text-secondary">No reservations found</td></tr>
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
export class ReservationListComponent {
  searchQuery = '';
  dateFilter = '';
  statusFilter = '';

  reservations = signal<Reservation[]>([
    { id: '1', confirmationCode: 'RES-A1B2C3', customerName: 'John Smith', customerPhone: '+1 555-0101', restaurantName: 'The Golden Fork', date: '2024-01-25', time: '19:00', partySize: 4, status: 'CONFIRMED' },
    { id: '2', confirmationCode: 'RES-D4E5F6', customerName: 'Sarah Johnson', customerPhone: '+1 555-0102', restaurantName: 'Sakura Garden', date: '2024-01-25', time: '20:30', partySize: 2, status: 'PENDING' },
    { id: '3', confirmationCode: 'RES-G7H8I9', customerName: 'Mike Wilson', customerPhone: '+1 555-0103', restaurantName: 'The Golden Fork', date: '2024-01-24', time: '18:00', partySize: 6, status: 'COMPLETED' },
    { id: '4', confirmationCode: 'RES-J0K1L2', customerName: 'Emily Brown', customerPhone: '+1 555-0104', restaurantName: 'Spice Route', date: '2024-01-26', time: '19:30', partySize: 3, status: 'PENDING' },
    { id: '5', confirmationCode: 'RES-M3N4O5', customerName: 'David Lee', customerPhone: '+1 555-0105', restaurantName: 'Sakura Garden', date: '2024-01-23', time: '21:00', partySize: 2, status: 'CANCELLED' }
  ]);

  filteredReservations = signal<Reservation[]>([]);

  constructor() { this.filteredReservations.set(this.reservations()); }

  applyFilters(): void {
    let result = this.reservations();
    if (this.searchQuery) { const q = this.searchQuery.toLowerCase(); result = result.filter(r => r.customerName.toLowerCase().includes(q) || r.confirmationCode.toLowerCase().includes(q)); }
    if (this.statusFilter) result = result.filter(r => r.status === this.statusFilter);
    if (this.dateFilter) result = result.filter(r => r.date === this.dateFilter);
    this.filteredReservations.set(result);
  }

  getCountByStatus(status: string): number { return this.reservations().filter(r => r.status === status).length; }
  getTodayCount(): number { return this.reservations().filter(r => r.date === new Date().toISOString().split('T')[0]).length; }
  getStatusClass(status: string): string {
    const classes: Record<string, string> = { 'PENDING': 'bg-warning/10 text-warning', 'CONFIRMED': 'bg-success/10 text-success', 'COMPLETED': 'bg-primary/10 text-primary', 'CANCELLED': 'bg-error/10 text-error' };
    return classes[status] || '';
  }
  updateStatus(r: Reservation, status: Reservation['status']): void {
    this.reservations.update(list => list.map(res => res.id === r.id ? { ...res, status } : res));
    this.applyFilters();
  }
}
