import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-super-admin-restaurant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-3xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/super-admin/restaurants" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Add Restaurant</h1>
                <p class="text-secondary text-sm">Register a new restaurant in the system</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Assign Owner</h2>
                <div>
                  <label class="block text-sm font-medium text-secondary-dark mb-2">Restaurant Admin *</label>
                  <select formControlName="ownerId" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select an admin</option>
                    @for (admin of restaurantAdmins; track admin.id) {
                      <option [value]="admin.id">{{ admin.name }} ({{ admin.email }}) - {{ admin.restaurantCount }} restaurants</option>
                    }
                  </select>
                  <p class="text-sm text-secondary mt-2">Or <a routerLink="/super-admin/users/new" class="text-primary hover:underline">create a new restaurant admin</a></p>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Restaurant Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Restaurant Name *</label>
                    <input type="text" formControlName="name" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Restaurant name"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Cuisine Type *</label>
                    <select formControlName="cuisineType" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
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
                    <select formControlName="priceRange" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select price range</option>
                      <option value="BUDGET">$ Budget</option>
                      <option value="MODERATE">$$ Moderate</option>
                      <option value="PREMIUM">$$$ Premium</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Description</label>
                    <textarea formControlName="description" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Restaurant description..."></textarea>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Location</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Address *</label>
                    <input type="text" formControlName="address" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Full address"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Region *</label>
                    <select formControlName="region" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select region</option>
                      <option value="NORTH">North</option>
                      <option value="SOUTH">South</option>
                      <option value="EAST">East</option>
                      <option value="WEST">West</option>
                      <option value="CENTRAL">Central</option>
                      <option value="DOWNTOWN">Downtown</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">City *</label>
                    <input type="text" formControlName="city" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="City"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Phone *</label>
                    <input type="tel" formControlName="phone" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 555-0000"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Website</label>
                    <input type="url" formControlName="website" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..."/>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <a routerLink="/super-admin/restaurants" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
                <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ saving() ? 'Creating...' : 'Create Restaurant' }}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminRestaurantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  saving = signal(false);

  restaurantAdmins = [
    { id: '1', name: 'John Smith', email: 'john@restaurant.com', restaurantCount: 2 },
    { id: '3', name: 'Mike Wilson', email: 'mike@bistro.com', restaurantCount: 1 },
    { id: '5', name: 'David Lee', email: 'david@cafe.com', restaurantCount: 3 }
  ];

  form: FormGroup = this.fb.group({
    ownerId: ['', Validators.required],
    name: ['', Validators.required],
    cuisineType: ['', Validators.required],
    priceRange: ['', Validators.required],
    description: [''],
    address: ['', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    website: ['']
  });

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    console.log('Creating restaurant:', this.form.value);

    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/super-admin/restaurants']);
    }, 500);
  }
}
