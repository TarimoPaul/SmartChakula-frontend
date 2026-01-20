import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-customer-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-reservation.component.html',
  styleUrl: './customer-reservation.component.css'
})
export class CustomerReservationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private restaurantService = inject(RestaurantService);

  restaurantId = '';
  restaurantName = signal('Loading...');
  submitting = signal(false);
  showConfirmation = signal(false);
  confirmationCode = signal('');

  minDate = new Date().toISOString().split('T')[0];
  partySizes = [1, 2, 3, 4, 5, 6, 7, 8];
  availableTimes = ['11:00', '11:30', '12:00', '12:30', '13:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  form: FormGroup = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    partySize: [2, Validators.required],
    guestName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    specialRequests: ['']
  });

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id') || '';
    if (this.restaurantId) {
      this.restaurantService.getById(this.restaurantId).subscribe({
        next: (restaurant) => this.restaurantName.set(restaurant.name),
        error: () => this.restaurantName.set('Restaurant')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const formValue = this.form.value;
    this.reservationService.create({
      restaurantId: this.restaurantId,
      reservationDate: formValue.date,
      reservationTime: formValue.time,
      partySize: formValue.partySize,
      guestName: formValue.guestName,
      guestEmail: formValue.email,
      guestPhone: formValue.phone,
      specialRequests: formValue.specialRequests
    }).subscribe({
      next: (reservation) => {
        this.submitting.set(false);
        this.confirmationCode.set(reservation.confirmationCode);
        this.showConfirmation.set(true);
      },
      error: (err) => {
        console.error('Failed to create reservation:', err);
        this.submitting.set(false);
        alert('Failed to create reservation. Please try again.');
      }
    });
  }
}
