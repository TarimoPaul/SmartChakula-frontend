import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaCategory, SmartCakulaCategoryInput, SmartCakulaRestaurant } from '../../../core/services/graphql.service';

interface CategoryUi {
  uid: string;
  name: string;
  description: string;
  restaurantUid: string;
  itemCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  private graphql = inject(GraphQLService);

  categories = signal<CategoryUi[]>([]);
  restaurants = signal<SmartCakulaRestaurant[]>([]);

  showAddModal = signal(false);
  editingCategory = signal<CategoryUi | null>(null);
  saving = signal(false);

  showDeleteConfirm = signal(false);
  categoryToDelete = signal<CategoryUi | null>(null);

  toastVisible = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  categoryForm: { restaurantUid: string; name: string; description: string } = {
    restaurantUid: '',
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadCategories();
  }

  getCategoryIcon(name: string): string {
    const icons: Record<string, string> = {
      'Main Courses': '🍽️',
      'Appetizers': '🥗',
      'Desserts': '🍰',
      'Beverages': '🍹',
      'Specials': '⭐'
    };
    return icons[name] || '📂';
  }

  openAddModal(): void {
    this.editingCategory.set(null);
    this.categoryForm = { restaurantUid: '', name: '', description: '' };
    this.showAddModal.set(true);
  }

  toggleCategory(cat: CategoryUi): void {
    // Backend updateCategory doesn't currently accept isActive, so keep this UI-only for now.
    this.categories.update(list => list.map(c => c.uid === cat.uid ? { ...c, isActive: !c.isActive } : c));
  }

  editCategory(cat: CategoryUi): void {
    this.editingCategory.set(cat);
    this.categoryForm = { restaurantUid: cat.restaurantUid, name: cat.name, description: cat.description };
    this.showAddModal.set(true);
  }

  deleteCategory(cat: CategoryUi): void {
    this.categoryToDelete.set(cat);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    const cat = this.categoryToDelete();
    if (!cat) return;
    this.saving.set(true);
    this.graphql.deleteSmartCakulaCategory(cat.uid).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelDelete();
        this.showToast('Category deleted successfully', 'success');
        this.loadCategories();
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Failed to delete category', 'error');
      }
    });
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.editingCategory.set(null);
    this.categoryForm = { restaurantUid: '', name: '', description: '' };
  }

  saveCategory(): void {
    if (!this.categoryForm.name || !this.categoryForm.restaurantUid) return;
    this.saving.set(true);

    const isEditing = !!this.editingCategory();

    const input: SmartCakulaCategoryInput = {
      uid: this.editingCategory()?.uid || undefined,
      name: this.categoryForm.name,
      description: this.categoryForm.description || undefined,
      restaurantUid: this.categoryForm.restaurantUid
    };

    const request$ = this.editingCategory()
      ? this.graphql.updateSmartCakulaCategory(input)
      : this.graphql.createSmartCakulaCategory(input);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.showToast(isEditing ? 'Category updated successfully' : 'Category created successfully', 'success');
        this.loadCategories();
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Failed to save category', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);

    window.setTimeout(() => {
      this.toastVisible.set(false);
    }, 2500);
  }

  private loadCategories(): void {
    this.graphql.getSmartCakulaCategories().subscribe({
      next: (cats) => this.categories.set(cats.map(c => this.mapToUi(c))),
      error: () => this.categories.set([])
    });
  }

  private loadRestaurants(): void {
    this.graphql.getSmartCakulaRestaurants().subscribe({
      next: (list) => this.restaurants.set(list),
      error: () => this.restaurants.set([])
    });
  }

  private mapToUi(c: SmartCakulaCategory): CategoryUi {
    return {
      uid: c.uid,
      name: c.name,
      description: c.description || '',
      restaurantUid: c.restaurantUid,
      itemCount: 0,
      isActive: !!c.isActive
    };
  }
}
