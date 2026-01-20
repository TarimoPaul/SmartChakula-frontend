import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-menu-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-3xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/menus" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">{{ isEditMode() ? 'Edit Menu Item' : 'Add Menu Item' }}</h1>
                <p class="text-secondary text-sm">{{ selectedRestaurant() || 'Select a restaurant' }}</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Restaurant Selection -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Restaurant</h2>
                <select formControlName="restaurantId" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select Restaurant</option>
                  @for (r of restaurants; track r.id) {
                    <option [value]="r.id">{{ r.name }}</option>
                  }
                </select>
              </div>

              <!-- Item Details -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Item Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Item Name *</label>
                    <input type="text" formControlName="name" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Grilled Salmon"/>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Category *</label>
                    <select formControlName="category" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Category</option>
                      <option value="MAIN_MEAL">Main Meal</option>
                      <option value="DESSERT">Dessert</option>
                      <option value="DRINKS">Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Price *</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">$</span>
                      <input type="number" formControlName="price" step="0.01" min="0" class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00"/>
                    </div>
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Description</label>
                    <textarea formControlName="description" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Describe the dish, ingredients, etc."></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Portion Size</label>
                    <input type="text" formControlName="portionSize" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 250g, Large"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Preparation Time (mins)</label>
                    <input type="number" formControlName="preparationTime" min="0" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="15"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Calories</label>
                    <input type="number" formControlName="calories" min="0" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="350"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-dark mb-1">Dietary Tags</label>
                    <div class="flex flex-wrap gap-2">
                      @for (tag of dietaryTags; track tag) {
                        <button type="button" (click)="toggleTag(tag)" class="px-3 py-1.5 rounded-full text-sm border transition-colors" [ngClass]="selectedTags().includes(tag) ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-gray-200 hover:border-primary'">
                          {{ tag }}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Item Image</h2>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer" (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                  @if (imagePreview()) {
                    <div class="relative inline-block">
                      <img [src]="imagePreview()" alt="Preview" class="max-h-48 rounded-lg mx-auto"/>
                      <button type="button" (click)="removeImage($event)" class="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full hover:bg-error/80">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  } @else {
                    <div class="space-y-3">
                      <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <div>
                        <p class="text-secondary-dark font-medium">Drop image here or click to upload</p>
                        <p class="text-secondary text-sm">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  }
                  <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)"/>
                </div>
              </div>

              <!-- Availability -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-semibold text-secondary-dark">Availability</h2>
                    <p class="text-secondary text-sm">Toggle to make this item available on the menu</p>
                  </div>
                  <button type="button" (click)="toggleAvailability()" class="relative inline-flex h-7 w-14 items-center rounded-full transition-colors" [ngClass]="isAvailable() ? 'bg-success' : 'bg-gray-300'">
                    <span class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow" [ngClass]="isAvailable() ? 'translate-x-8' : 'translate-x-1'"></span>
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3">
                <a routerLink="/menus" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
                <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ saving() ? 'Saving...' : (isEditMode() ? 'Update Item' : 'Add Item') }}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MenuItemFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  saving = signal(false);
  selectedRestaurant = signal<string>('');
  imagePreview = signal<string | null>(null);
  selectedTags = signal<string[]>([]);
  isAvailable = signal(true);

  restaurants = [
    { id: '1', name: 'The Golden Fork' },
    { id: '2', name: 'Sakura Garden' },
    { id: '3', name: 'Spice Route' }
  ];

  dietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Spicy', 'Halal', 'Kosher'];

  form: FormGroup = this.fb.group({
    restaurantId: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    portionSize: [''],
    preparationTime: [''],
    calories: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const restaurantId = this.route.snapshot.queryParamMap.get('restaurantId');
    
    if (restaurantId) {
      this.form.patchValue({ restaurantId });
      const restaurant = this.restaurants.find(r => r.id === restaurantId);
      if (restaurant) this.selectedRestaurant.set(restaurant.name);
    }

    if (id) {
      this.isEditMode.set(true);
      // Load existing item data
      this.form.patchValue({
        name: 'Grilled Salmon',
        category: 'MAIN_MEAL',
        price: 24.99,
        description: 'Fresh Atlantic salmon with herbs',
        portionSize: '300g',
        preparationTime: 20,
        calories: 450
      });
      this.selectedTags.set(['Gluten-Free']);
    }
  }

  toggleTag(tag: string): void {
    this.selectedTags.update(tags => 
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  toggleAvailability(): void {
    this.isAvailable.update(v => !v);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imagePreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    
    const formData = {
      ...this.form.value,
      dietaryTags: this.selectedTags(),
      isAvailable: this.isAvailable(),
      imageUrl: this.imagePreview()
    };
    
    console.log('Submitting menu item:', formData);
    
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/menus']);
    }, 500);
  }
}
