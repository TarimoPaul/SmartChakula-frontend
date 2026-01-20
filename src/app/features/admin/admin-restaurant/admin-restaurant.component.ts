import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-restaurant.component.html',
  styleUrl: './admin-restaurant.component.css'
})
export class AdminRestaurantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  saving = signal(false);
  restaurantId = '';

  weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  workingDays = signal<Record<string, boolean>>({
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false
  });

  workingHours = signal<Record<string, { open: string; close: string }>>({
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' }
  });

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    cuisineType: ['', Validators.required],
    priceRange: ['', Validators.required],
    description: [''],
    formattedAddress: ['', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required],
    latitude: [null],
    longitude: [null],
    phone: ['', Validators.required],
    website: ['']
  });

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    if (this.restaurantId) {
      this.isEditMode.set(true);
      this.loadRestaurant();
    }
  }

  loadRestaurant(): void {
    // Mock data - in production, fetch from API
    const mockRestaurant = {
      name: 'The Golden Fork',
      cuisineType: 'Italian',
      priceRange: 'PREMIUM',
      description: 'Experience the finest Italian cuisine in a warm and elegant atmosphere.',
      formattedAddress: '123 Main St, New York, NY 10001',
      region: 'DOWNTOWN',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      phone: '+1 555-1234',
      website: 'https://goldenfork.com'
    };
    this.form.patchValue(mockRestaurant);
  }

  toggleDay(day: string): void {
    this.workingDays.update(days => ({ ...days, [day]: !days[day] }));
  }

  updateHours(day: string, type: 'open' | 'close', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.workingHours.update(hours => ({
      ...hours,
      [day]: { ...hours[day], [type]: value }
    }));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const formData = {
      ...this.form.value,
      workingHours: this.weekDays
        .filter(d => this.workingDays()[d.key])
        .map(d => ({
          day: d.key.toUpperCase(),
          openTime: this.workingHours()[d.key].open,
          closeTime: this.workingHours()[d.key].close
        }))
    };

    console.log('Saving restaurant:', formData);

    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/admin/restaurants']);
    }, 500);
  }
}
