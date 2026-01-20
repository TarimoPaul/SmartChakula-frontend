import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/restaurants" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">{{ isEditMode() ? 'Edit Restaurant' : 'Add Restaurant' }}</h1>
                <p class="text-secondary text-sm">{{ isEditMode() ? 'Update restaurant information' : 'Create a new restaurant listing' }}</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Basic Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Restaurant Name *</label>
                    <input type="text" formControlName="name" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter restaurant name"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Cuisine Type *</label>
                    <select formControlName="cuisineType" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select cuisine</option>
                      <option value="Italian">Italian</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Indian">Indian</option>
                      <option value="Mexican">Mexican</option>
                      <option value="French">French</option>
                      <option value="Chinese">Chinese</option>
                      <option value="American">American</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Price Range *</label>
                    <select formControlName="priceRange" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select price range</option>
                      <option value="BUDGET">$ Budget</option>
                      <option value="MODERATE">$$ Moderate</option>
                      <option value="PREMIUM">$$$ Premium</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Description</label>
                    <textarea formControlName="description" rows="3" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Describe your restaurant..."></textarea>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Location & Contact</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Address</label>
                    <input type="text" formControlName="formattedAddress" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter full address"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Region *</label>
                    <select formControlName="region" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select region</option>
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
                    <label class="block text-sm font-medium text-secondary-dark mb-1">City</label>
                    <input type="text" formControlName="city" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="New York"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Latitude</label>
                    <input type="number" formControlName="latitude" step="any" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="40.7128"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Longitude</label>
                    <input type="number" formControlName="longitude" step="any" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="-74.0060"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Phone</label>
                    <input type="tel" formControlName="phone" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 (555) 000-0000"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Website</label>
                    <input type="url" formControlName="website" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://example.com"/>
                  </div>
                </div>
              </div>

              <!-- Working Hours -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Working Hours</h2>
                <div class="space-y-3">
                  @for (day of weekDays; track day.key) {
                    <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div class="w-28">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" [checked]="workingDays()[day.key]" (change)="toggleDay(day.key)" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"/>
                          <span class="font-medium text-secondary-dark">{{ day.label }}</span>
                        </label>
                      </div>
                      @if (workingDays()[day.key]) {
                        <div class="flex items-center gap-2 flex-1">
                          <input type="time" [value]="workingHours()[day.key]?.open || '09:00'" (change)="updateHours(day.key, 'open', $event)" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                          <span class="text-secondary">to</span>
                          <input type="time" [value]="workingHours()[day.key]?.close || '22:00'" (change)="updateHours(day.key, 'close', $event)" class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                      } @else {
                        <span class="text-secondary italic">Closed</span>
                      }
                    </div>
                  }
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <a routerLink="/restaurants" class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</a>
                <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ saving() ? 'Saving...' : (isEditMode() ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  `
})
export class RestaurantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  saving = signal(false);

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
    name: ['', [Validators.required]],
    cuisineType: ['', Validators.required],
    priceRange: ['', Validators.required],
    description: [''],
    formattedAddress: [''],
    region: ['', Validators.required],
    city: [''],
    latitude: [''],
    longitude: [''],
    phone: [''],
    website: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.route.snapshot.url.some(s => s.path === 'edit')) {
      this.isEditMode.set(true);
      this.form.patchValue({ 
        name: 'The Golden Fork', 
        cuisineType: 'Italian', 
        priceRange: 'PREMIUM', 
        description: 'Fine Italian dining', 
        formattedAddress: '123 Main St, New York, NY 10001',
        region: 'DOWNTOWN',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        phone: '+1 555-1234' 
      });
    }
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
    
    console.log('Submitting restaurant:', formData);
    
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/restaurants']);
    }, 500);
  }
}
