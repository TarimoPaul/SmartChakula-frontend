import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaCategory, SmartCakulaMenuItemInput, SmartCakulaRestaurant } from '../../../core/services/graphql.service';

@Component({
  selector: 'app-admin-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-menu-form.component.html',
  styleUrl: './admin-menu-form.component.css'
})
export class AdminMenuFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private graphql = inject(GraphQLService);

  isEditMode = signal(false);
  saving = signal(false);
  imagePreview = signal<string | null>(null);
  logoDataUrl = this.imagePreview;
  selectedTags = signal<string[]>([]);
  selectedRestaurantName = signal<string>('');

  toastVisible = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  restaurants = signal<SmartCakulaRestaurant[]>([]);
  categories = signal<SmartCakulaCategory[]>([]);
  filteredCategories = signal<SmartCakulaCategory[]>([]);

  private readonly selectedRestaurantStorageKey = 'selectedRestaurantUid';

  dietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Spicy', 'Halal', 'Kosher'];

  form: FormGroup = this.fb.group({
    restaurantUid: ['', Validators.required],
    name: ['', Validators.required],
    categoryUid: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    isAvailable: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadRestaurants();
    this.loadCategories();

    const restaurantUidFromSidebar = localStorage.getItem(this.selectedRestaurantStorageKey) || '';
    if (restaurantUidFromSidebar) {
      this.form.patchValue({ restaurantUid: restaurantUidFromSidebar });
      this.updateRestaurantName(restaurantUidFromSidebar);
      this.filterCategories(restaurantUidFromSidebar);
    }

    this.form.get('restaurantUid')?.valueChanges.subscribe((uid) => {
      const nextUid = (uid || '').toString();
      this.updateRestaurantName(nextUid);
      this.filterCategories(nextUid);
    });

    if (id) {
      this.isEditMode.set(true);
      this.graphql.getSmartCakulaMenuItem(id).subscribe({
        next: (item) => {
          if (!item) return;
          this.form.patchValue({
            restaurantUid: item.restaurantUid,
            name: item.name,
            categoryUid: item.categoryUid,
            price: item.price,
            description: item.description || '',
            isAvailable: !!item.isAvailable
          });
          this.logoDataUrl.set(item.image || null);
          this.updateRestaurantName(item.restaurantUid);
          this.filterCategories(item.restaurantUid);
        },
        error: () => {
          this.showToast('Failed to load menu item', 'error');
        }
      });
    }
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);

    window.setTimeout(() => {
      this.toastVisible.set(false);
    }, 2500);
  }

  private loadRestaurants(): void {
    this.graphql.getSmartCakulaRestaurants().subscribe({
      next: (list) => {
        this.restaurants.set(list);
        const currentUid = (this.form.value.restaurantUid || '').toString();
        if (currentUid) this.updateRestaurantName(currentUid);
      },
      error: () => this.restaurants.set([])
    });
  }

  private loadCategories(): void {
    this.graphql.getSmartCakulaCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        const currentUid = (this.form.value.restaurantUid || '').toString();
        if (currentUid) this.filterCategories(currentUid);
      },
      error: () => this.categories.set([])
    });
  }

  private updateRestaurantName(restaurantUid: string): void {
    if (!restaurantUid) {
      this.selectedRestaurantName.set('');
      return;
    }
    const r = this.restaurants().find(x => x.uid === restaurantUid);
    this.selectedRestaurantName.set(r?.name || '');
  }

  private filterCategories(restaurantUid: string): void {
    if (!restaurantUid) {
      this.filteredCategories.set([]);
      return;
    }
    const filtered = this.categories().filter(c => c.restaurantUid === restaurantUid);
    this.filteredCategories.set(filtered);

    const currentCategoryUid = (this.form.value.categoryUid || '').toString();
    if (currentCategoryUid && !filtered.some(c => c.uid === currentCategoryUid)) {
      this.form.patchValue({ categoryUid: '' });
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

    const input: SmartCakulaMenuItemInput = {
      name: this.form.value.name,
      description: this.form.value.description || undefined,
      price: Number(this.form.value.price),
      image: this.imagePreview() || undefined,
      isAvailable: !!this.form.value.isAvailable,
      categoryUid: this.form.value.categoryUid,
      restaurantUid: this.form.value.restaurantUid
    };

    const uid = this.route.snapshot.paramMap.get('id');

    if (uid && this.isEditMode()) {
      this.graphql.updateSmartCakulaMenuItem(uid, input).subscribe({
        next: () => {
          this.saving.set(false);
          sessionStorage.setItem('adminMenuToast', JSON.stringify({ message: 'Menu item updated successfully', type: 'success' }));
          this.router.navigate(['/admin/menu']);
        },
        error: () => {
          this.saving.set(false);
          this.showToast('Failed to update menu item', 'error');
        }
      });
      return;
    }

    this.graphql.createSmartCakulaMenuItem(input).subscribe({
      next: () => {
        this.saving.set(false);
        sessionStorage.setItem('adminMenuToast', JSON.stringify({ message: 'Menu item created successfully', type: 'success' }));
        this.router.navigate(['/admin/menu']);
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Failed to create menu item', 'error');
      }
    });
  }
}
