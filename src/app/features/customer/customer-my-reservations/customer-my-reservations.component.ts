import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models';

interface ReservationDisplay extends Reservation {
  restaurantName?: string;
  date?: string;
  time?: string;
}

@Component({
  selector: 'app-customer-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-my-reservations.component.html',
  styleUrl: './customer-my-reservations.component.css'
})
export class CustomerMyReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);

  activeTab = signal<'upcoming' | 'past'>('upcoming');
  loading = signal(false);

  reservations = signal<ReservationDisplay[]>([]);
  filteredReservations = signal<ReservationDisplay[]>([]);

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        const mapped = data.map(r => ({
          ...r,
          restaurantName: r.restaurant?.name || 'Restaurant',
          date: r.reservationDate,
          time: r.reservationTime
        }));
        this.reservations.set(mapped);
        this.updateFiltered();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reservations:', err);
        this.loading.set(false);
      }
    });
  }

  updateFiltered(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.activeTab() === 'upcoming') {
      this.filteredReservations.set(
        this.reservations().filter(r => (r.date || '') >= today && r.status !== 'CANCELLED' && r.status !== 'COMPLETED')
      );
    } else {
      this.filteredReservations.set(
        this.reservations().filter(r => (r.date || '') < today || r.status === 'COMPLETED' || r.status === 'CANCELLED')
      );
    }
  }

  getUpcomingCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.reservations().filter(r => (r.date || '') >= today && r.status !== 'CANCELLED' && r.status !== 'COMPLETED').length;
  }

  getPastCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.reservations().filter(r => (r.date || '') < today || r.status === 'COMPLETED' || r.status === 'CANCELLED').length;
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

  cancelReservation(r: ReservationDisplay): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.reservationService.cancel(r.id).subscribe({
        next: () => this.loadReservations(),
        error: (err) => console.error('Failed to cancel reservation:', err)
      });
    }
  }
}
