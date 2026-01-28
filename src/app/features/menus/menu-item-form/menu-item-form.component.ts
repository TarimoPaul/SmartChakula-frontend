import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaCategory, SmartCakulaMenuItemInput, SmartCakulaRestaurant } from '../../../core/services/graphql.service';

@Component({
  selector: 'app-menu-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './menu-item-form.component.html',
  styleUrl: './menu-item-form.component.css'
})
export class MenuItemFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private graphql = inject(GraphQLService);

  isEditMode = signal(false);
  saving = signal(false);
  selectedRestaurant = signal<string>('');
  imagePreview = signal<string | null>(null);
  selectedTags = signal<string[]>([]);
  isAvailable = signal(true);

  restaurants = signal<SmartCakulaRestaurant[]>([]);
  categories = signal<SmartCakulaCategory[]>([]);

  private readonly selectedRestaurantStorageKey = 'selectedRestaurantUid';

  dietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Spicy', 'Halal', 'Kosher'];

  form: FormGroup = this.fb.group({
    restaurantUid: ['', Validators.required],
    name: ['', Validators.required],
    categoryUid: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    portionSize: [''],
    preparationTime: [''],
    calories: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const restaurantUidFromQuery = this.route.snapshot.queryParamMap.get('restaurantUid');
    const restaurantUidFromSidebar = localStorage.getItem(this.selectedRestaurantStorageKey) || '';

    this.loadRestaurants();
    this.loadCategories();

    const restaurantUidToUse = restaurantUidFromQuery || restaurantUidFromSidebar;
    if (restaurantUidToUse) {
      this.form.patchValue({ restaurantUid: restaurantUidToUse });
      this.updateSelectedRestaurantName(restaurantUidToUse);
      this.filterCategoriesForRestaurant(restaurantUidToUse);
    }

    this.form.get('restaurantUid')?.valueChanges.subscribe((uid) => {
      const nextUid = (uid || '').toString();
      this.updateSelectedRestaurantName(nextUid);
      this.filterCategoriesForRestaurant(nextUid);
    });

    if (id) {
      this.isEditMode.set(true);
      // Backend does not currently expose a dedicated getMenuItem(uid) query.
      // Edit mode will still work for saving if the form is filled.
    }
  }

  private loadRestaurants(): void {
    this.graphql.getSmartCakulaRestaurants().subscribe({
      next: (list) => {
        this.restaurants.set(list);
        const currentUid = (this.form.value.restaurantUid || '').toString();
        if (currentUid) this.updateSelectedRestaurantName(currentUid);
      },
      error: () => this.restaurants.set([])
    });
  }

  private loadCategories(): void {
    this.graphql.getSmartCakulaCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        const currentUid = (this.form.value.restaurantUid || '').toString();
        if (currentUid) this.filterCategoriesForRestaurant(currentUid);
      },
      error: () => this.categories.set([])
    });
  }

  private updateSelectedRestaurantName(restaurantUid: string): void {
    if (!restaurantUid) {
      this.selectedRestaurant.set('');
      return;
    }
    const restaurant = this.restaurants().find(r => r.uid === restaurantUid);
    this.selectedRestaurant.set(restaurant?.name || '');
  }

  private filterCategoriesForRestaurant(restaurantUid: string): void {
    if (!restaurantUid) return;
    // Keep only categories belonging to selected restaurant.
    const filtered = this.categories().filter(c => c.restaurantUid === restaurantUid);
    this.categories.set(filtered);

    const currentCategoryUid = (this.form.value.categoryUid || '').toString();
    if (currentCategoryUid && !filtered.some(c => c.uid === currentCategoryUid)) {
      this.form.patchValue({ categoryUid: '' });
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

    const input: SmartCakulaMenuItemInput = {
      name: this.form.value.name,
      description: this.form.value.description || undefined,
      price: Number(this.form.value.price),
      image: this.imagePreview() || undefined,
      isAvailable: this.isAvailable(),
      categoryUid: this.form.value.categoryUid,
      restaurantUid: this.form.value.restaurantUid
    };

    const uid = this.route.snapshot.paramMap.get('id');

    if (uid && this.isEditMode()) {
      this.graphql.updateSmartCakulaMenuItem(uid, input).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/admin/menu']);
        },
        error: () => {
          this.saving.set(false);
        }
      });
      return;
    }

    this.graphql.createSmartCakulaMenuItem(input).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/menu']);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
