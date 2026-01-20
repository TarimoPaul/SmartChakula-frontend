import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-admin-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-3xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/admin/menu" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">{{ isEditMode() ? 'Edit Menu Item' : 'Add Menu Item' }}</h1>
                <p class="text-secondary text-sm">{{ isEditMode() ? 'Update item details' : 'Create a new menu item' }}</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Basic Info -->
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
                      <option value="">Select category</option>
                      <option value="Main Courses">Main Courses</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Specials">Specials</option>
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
                    <textarea formControlName="description" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Describe the dish..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Item Image</h2>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (drop)="onDrop($event)">
                  @if (imagePreview()) {
                    <img [src]="imagePreview()" alt="Preview" class="max-h-48 mx-auto rounded-lg mb-4"/>
                    <button type="button" (click)="removeImage($event)" class="text-error text-sm hover:underline">Remove Image</button>
                  } @else {
                    <div class="text-4xl mb-3">📷</div>
                    <p class="text-secondary mb-2">Drag and drop an image or click to browse</p>
                    <p class="text-xs text-secondary">PNG, JPG up to 5MB</p>
                  }
                  <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)"/>
                </div>
              </div>

              <!-- Dietary Tags -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Dietary Information</h2>
                <div class="flex flex-wrap gap-2">
                  @for (tag of dietaryTags; track tag) {
                    <button type="button" (click)="toggleTag(tag)"
                      class="px-4 py-2 rounded-full border-2 transition-all"
                      [ngClass]="selectedTags().includes(tag) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-secondary hover:border-primary/50'">
                      {{ tag }}
                    </button>
                  }
                </div>
              </div>

              <!-- Availability -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-semibold text-secondary-dark">Availability</h2>
                    <p class="text-sm text-secondary">Make this item visible on the menu</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="isAvailable" class="sr-only peer"/>
                    <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3">
                <a routerLink="/admin/menu" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
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
export class AdminMenuFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  saving = signal(false);
  imagePreview = signal<string | null>(null);
  selectedTags = signal<string[]>([]);

  dietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Spicy', 'Halal', 'Kosher'];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    isAvailable: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.form.patchValue({
        name: 'Grilled Salmon',
        category: 'Main Courses',
        price: 28.99,
        description: 'Fresh Atlantic salmon with herbs and lemon butter sauce',
        isAvailable: true
      });
      this.selectedTags.set(['Gluten-Free']);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.previewFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.previewFile(file);
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imagePreview.set(null);
  }

  toggleTag(tag: string): void {
    this.selectedTags.update(tags => 
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const formData = {
      ...this.form.value,
      dietaryTags: this.selectedTags(),
      imageUrl: this.imagePreview()
    };

    console.log('Saving menu item:', formData);

    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/admin/menu']);
    }, 500);
  }
}
