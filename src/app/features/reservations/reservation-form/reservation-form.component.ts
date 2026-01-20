import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/reservations" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Book a Table</h1>
                <p class="text-secondary text-sm">Make a reservation at your favorite restaurant</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Restaurant Selection -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Select Restaurant</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Region</label>
                    <select formControlName="region" (change)="onRegionChange()" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">All Regions</option>
                      <option value="NORTH">North</option>
                      <option value="SOUTH">South</option>
                      <option value="EAST">East</option>
                      <option value="WEST">West</option>
                      <option value="CENTRAL">Central</option>
                      <option value="DOWNTOWN">Downtown</option>
                      <option value="SUBURBAN">Suburban</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Restaurant *</label>
                    <select formControlName="restaurantId" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select a restaurant</option>
                      @for (r of filteredRestaurants(); track r.id) {
                        <option [value]="r.id">{{ r.name }} - {{ r.region }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <!-- Guest Information -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Guest Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Full Name *</label>
                    <input type="text" formControlName="guestName" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Email *</label>
                    <input type="email" formControlName="email" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Phone *</label>
                    <input type="tel" formControlName="phone" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 (555) 000-0000"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Party Size *</label>
                    <select formControlName="partySize" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      @for (size of partySizes; track size) {
                        <option [value]="size">{{ size }} {{ size === 1 ? 'Guest' : 'Guests' }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <!-- Date & Time -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Date & Time</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Date *</label>
                    <input type="date" formControlName="reservationDate" [min]="minDate" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Time *</label>
                    <select formControlName="reservationTime" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      @for (time of availableTimes; track time) {
                        <option [value]="time">{{ time }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <!-- Special Requests -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Special Requests</h2>
                <textarea formControlName="specialRequests" rows="4" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Any dietary restrictions, special occasions, seating preferences..."></textarea>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3">
                <a routerLink="/reservations" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
                <button type="submit" [disabled]="form.invalid || submitting()" class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ submitting() ? 'Booking...' : 'Book Table' }}
                </button>
              </div>
            </form>

            <!-- Confirmation Modal -->
            @if (showConfirmation()) {
              <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                  <div class="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 class="text-xl font-bold text-secondary-dark mb-2">Reservation Confirmed!</h3>
                  <p class="text-secondary mb-4">Your confirmation code is:</p>
                  <p class="text-2xl font-mono font-bold text-primary mb-6">{{ confirmationCode() }}</p>
                  <a routerLink="/reservations" class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90">View My Reservations</a>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class ReservationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = signal(false);
  showConfirmation = signal(false);
  confirmationCode = signal('');

  restaurants = [
    { id: '1', name: 'The Golden Fork', region: 'DOWNTOWN' },
    { id: '2', name: 'Sakura Garden', region: 'WEST' },
    { id: '3', name: 'Spice Route', region: 'CENTRAL' },
    { id: '4', name: 'Le Petit Bistro', region: 'NORTH' }
  ];

  filteredRestaurants = signal(this.restaurants);

  partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];
  
  availableTimes = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  minDate = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    region: [''],
    restaurantId: ['', Validators.required],
    guestName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    partySize: [2, Validators.required],
    reservationDate: ['', Validators.required],
    reservationTime: ['', Validators.required],
    specialRequests: ['']
  });

  ngOnInit(): void {
    const restaurantId = this.route.snapshot.queryParamMap.get('restaurantId');
    if (restaurantId) {
      this.form.patchValue({ restaurantId });
    }
  }

  onRegionChange(): void {
    const region = this.form.get('region')?.value;
    if (region) {
      this.filteredRestaurants.set(this.restaurants.filter(r => r.region === region));
    } else {
      this.filteredRestaurants.set(this.restaurants);
    }
    this.form.patchValue({ restaurantId: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const code = 'RES-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    console.log('Submitting reservation:', this.form.value);

    setTimeout(() => {
      this.submitting.set(false);
      this.confirmationCode.set(code);
      this.showConfirmation.set(true);
    }, 1000);
  }
}
