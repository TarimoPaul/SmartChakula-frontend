import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-super-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/super-admin/users" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">{{ isEditMode() ? 'Edit User' : 'Create User' }}</h1>
                <p class="text-secondary text-sm">{{ isEditMode() ? 'Update user information' : 'Add a new system user' }}</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">User Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Full Name *</label>
                    <input type="text" formControlName="fullName" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Email *</label>
                    <input type="email" formControlName="email" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Phone</label>
                    <input type="tel" formControlName="phone" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 555-0000"/>
                  </div>
                  @if (!isEditMode()) {
                    <div>
                      <label class="block text-sm font-medium text-secondary-dark mb-1">Password *</label>
                      <input type="password" formControlName="password" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="********"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-secondary-dark mb-1">Confirm Password *</label>
                      <input type="password" formControlName="confirmPassword" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="********"/>
                    </div>
                  }
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Role & Permissions</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-2">User Role *</label>
                    <div class="grid grid-cols-3 gap-3">
                      <button type="button" (click)="form.patchValue({ role: 'RESTAURANT_ADMIN' })"
                        class="p-4 rounded-xl border-2 transition-all text-center"
                        [ngClass]="form.get('role')?.value === 'RESTAURANT_ADMIN' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
                        <div class="text-2xl mb-2">🍽️</div>
                        <p class="font-medium text-secondary-dark text-sm">Restaurant Admin</p>
                      </button>
                      <button type="button" (click)="form.patchValue({ role: 'CUSTOMER' })"
                        class="p-4 rounded-xl border-2 transition-all text-center"
                        [ngClass]="form.get('role')?.value === 'CUSTOMER' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
                        <div class="text-2xl mb-2">👤</div>
                        <p class="font-medium text-secondary-dark text-sm">Customer</p>
                      </button>
                      <button type="button" (click)="form.patchValue({ role: 'SUPER_ADMIN' })"
                        class="p-4 rounded-xl border-2 transition-all text-center"
                        [ngClass]="form.get('role')?.value === 'SUPER_ADMIN' ? 'border-warning bg-warning/5' : 'border-gray-200 hover:border-warning/50'">
                        <div class="text-2xl mb-2">👑</div>
                        <p class="font-medium text-secondary-dark text-sm">Super Admin</p>
                      </button>
                    </div>
                  </div>

                  @if (form.get('role')?.value === 'RESTAURANT_ADMIN') {
                    <div>
                      <label class="block text-sm font-medium text-secondary-dark mb-2">Assign Restaurants</label>
                      <div class="space-y-2 max-h-48 overflow-y-auto">
                        @for (restaurant of availableRestaurants; track restaurant.id) {
                          <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="checkbox" [checked]="selectedRestaurants().includes(restaurant.id)" (change)="toggleRestaurant(restaurant.id)" class="w-4 h-4 text-primary rounded"/>
                            <div class="flex-1">
                              <p class="font-medium text-secondary-dark">{{ restaurant.name }}</p>
                              <p class="text-xs text-secondary">{{ restaurant.region }}</p>
                            </div>
                          </label>
                        }
                      </div>
                      <p class="text-sm text-secondary mt-2">{{ selectedRestaurants().length }} restaurant(s) selected</p>
                    </div>
                  }

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Status</label>
                    <select formControlName="status" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <a routerLink="/super-admin/users" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
                <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ saving() ? 'Saving...' : (isEditMode() ? 'Update User' : 'Create User') }}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminUserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  saving = signal(false);
  selectedRestaurants = signal<string[]>([]);

  availableRestaurants = [
    { id: '1', name: 'The Golden Fork', region: 'Downtown' },
    { id: '2', name: 'Sakura Garden', region: 'West' },
    { id: '3', name: 'Le Petit Bistro', region: 'North' },
    { id: '4', name: 'Spice Route', region: 'Central' },
    { id: '5', name: 'Casa Mexico', region: 'South' }
  ];

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: [''],
    confirmPassword: [''],
    role: ['RESTAURANT_ADMIN', Validators.required],
    status: ['ACTIVE']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.form.patchValue({
        fullName: 'John Smith',
        email: 'john@restaurant.com',
        phone: '+1 555-1234',
        role: 'RESTAURANT_ADMIN',
        status: 'ACTIVE'
      });
      this.selectedRestaurants.set(['1', '2']);
    }
  }

  toggleRestaurant(id: string): void {
    this.selectedRestaurants.update(list => 
      list.includes(id) ? list.filter(r => r !== id) : [...list, id]
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const userData = {
      ...this.form.value,
      restaurantIds: this.selectedRestaurants()
    };

    console.log('Saving user:', userData);

    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/super-admin/users']);
    }, 500);
  }
}
