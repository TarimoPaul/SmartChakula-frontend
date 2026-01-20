import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models';

interface ReservationDisplay extends Reservation {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  date?: string;
  time?: string;
}

@Component({
  selector: 'app-admin-reservations',
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
              <h1 class="text-2xl font-display font-bold text-secondary-dark">Reservations</h1>
              <p class="text-secondary text-sm mt-1">Manage your restaurant bookings</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Today</p>
                <p class="text-2xl font-bold text-secondary-dark">{{ getTodayCount() }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Pending</p>
                <p class="text-2xl font-bold text-warning">{{ getCountByStatus('PENDING') }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Confirmed</p>
                <p class="text-2xl font-bold text-success">{{ getCountByStatus('CONFIRMED') }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-4">
                <p class="text-secondary text-sm">Total Guests Today</p>
                <p class="text-2xl font-bold text-primary">{{ getTodayGuests() }}</p>
              </div>
            </div>

            <!-- Filters -->
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
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search by name or code..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
              </div>
            </div>

            <!-- Reservations Table -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 text-left text-sm text-secondary">
                  <tr>
                    <th class="px-4 py-3 font-medium">Code</th>
                    <th class="px-4 py-3 font-medium">Customer</th>
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
                      <td class="px-4 py-3">
                        <p class="font-medium text-secondary-dark">{{ r.customerName }}</p>
                        <p class="text-sm text-secondary">{{ r.customerPhone }}</p>
                      </td>
                      <td class="px-4 py-3">
                        <p class="font-medium text-secondary-dark">{{ r.date }}</p>
                        <p class="text-sm text-secondary">{{ r.time }}</p>
                      </td>
                      <td class="px-4 py-3 font-medium">{{ r.partySize }} guests</td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(r.status)">{{ r.status }}</span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-1">
                          @if (r.status === 'PENDING') {
                            <button (click)="updateStatus(r, 'CONFIRMED')" class="p-2 hover:bg-success/10 rounded-lg" title="Confirm">
                              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            </button>
                          }
                          @if (r.status === 'CONFIRMED') {
                            <button (click)="updateStatus(r, 'COMPLETED')" class="p-2 hover:bg-primary/10 rounded-lg" title="Mark Complete">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </button>
                          }
                          @if (r.status !== 'CANCELLED' && r.status !== 'COMPLETED') {
                            <button (click)="updateStatus(r, 'CANCELLED')" class="p-2 hover:bg-error/10 rounded-lg" title="Cancel">
                              <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          }
                          <button (click)="viewDetails(r)" class="p-2 hover:bg-gray-100 rounded-lg" title="View Details">
                            <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="px-4 py-12 text-center text-secondary">No reservations found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Details Modal -->
    @if (selectedReservation()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-secondary-dark">Reservation Details</h3>
            <button (click)="selectedReservation.set(null)" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between"><span class="text-secondary">Code:</span><span class="font-mono font-medium text-primary">{{ selectedReservation()!.confirmationCode }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Name:</span><span class="font-medium">{{ selectedReservation()!.customerName }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Phone:</span><span>{{ selectedReservation()!.customerPhone }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Email:</span><span>{{ selectedReservation()!.customerEmail }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Date:</span><span>{{ selectedReservation()!.date }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Time:</span><span>{{ selectedReservation()!.time }}</span></div>
            <div class="flex justify-between"><span class="text-secondary">Party Size:</span><span>{{ selectedReservation()!.partySize }} guests</span></div>
            @if (selectedReservation()!.specialRequests) {
              <div class="pt-2 border-t">
                <p class="text-secondary text-sm mb-1">Special Requests:</p>
                <p class="text-secondary-dark bg-gray-50 p-2 rounded">{{ selectedReservation()!.specialRequests }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class AdminReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  
  searchQuery = '';
  dateFilter = '';
  statusFilter = '';
  loading = signal(false);

  reservations = signal<ReservationDisplay[]>([]);
  filteredReservations = signal<ReservationDisplay[]>([]);
  selectedReservation = signal<ReservationDisplay | null>(null);

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    // For now, load all reservations - in production, filter by restaurant
    this.reservationService.getAll().subscribe({
      next: (response) => {
        const mapped = response.content.map(r => ({
          ...r,
          customerName: r.guestName || 'Guest',
          customerPhone: r.guestPhone || '',
          customerEmail: r.guestEmail || '',
          date: r.reservationDate,
          time: r.reservationTime
        }));
        this.reservations.set(mapped);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    let result = this.reservations();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r => (r.customerName || '').toLowerCase().includes(q) || r.confirmationCode.toLowerCase().includes(q));
    }
    if (this.statusFilter) result = result.filter(r => r.status === this.statusFilter);
    if (this.dateFilter) result = result.filter(r => r.date === this.dateFilter);
    this.filteredReservations.set(result);
  }

  getCountByStatus(status: string): number {
    return this.reservations().filter(r => r.status === status).length;
  }

  getTodayCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.reservations().filter(r => r.date === today).length;
  }

  getTodayGuests(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.reservations().filter(r => r.date === today).reduce((sum, r) => sum + r.partySize, 0);
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

  updateStatus(r: ReservationDisplay, status: Reservation['status']): void {
    this.reservationService.updateStatus(r.id, status).subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error('Failed to update status:', err)
    });
  }

  viewDetails(r: ReservationDisplay): void {
    this.selectedReservation.set(r);
  }
}
