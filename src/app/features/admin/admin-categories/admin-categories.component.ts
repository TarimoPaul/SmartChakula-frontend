import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Menu Categories</h1>
                <p class="text-secondary text-sm mt-1">Organize your menu items into categories</p>
              </div>
              <button (click)="showAddModal.set(true)" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Category
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (cat of categories(); track cat.id) {
                <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">{{ getCategoryIcon(cat.name) }}</span>
                      </div>
                      <div>
                        <h3 class="font-semibold text-secondary-dark">{{ cat.name }}</h3>
                        <p class="text-sm text-secondary">{{ cat.itemCount }} items</p>
                      </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" [checked]="cat.isActive" (change)="toggleCategory(cat)" class="sr-only peer"/>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <p class="text-sm text-secondary mb-4">{{ cat.description }}</p>
                  <div class="flex gap-2">
                    <button (click)="editCategory(cat)" class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Edit</button>
                    <button (click)="deleteCategory(cat)" class="px-3 py-2 text-sm text-error border border-error/20 rounded-lg hover:bg-error/5">Delete</button>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                  <div class="text-4xl mb-4">📂</div>
                  <p class="text-secondary mb-4">No categories yet</p>
                  <button (click)="showAddModal.set(true)" class="px-4 py-2 bg-primary text-white rounded-lg">Add Your First Category</button>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    @if (showAddModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-secondary-dark mb-4">{{ editingCategory() ? 'Edit Category' : 'Add Category' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Category Name *</label>
              <input type="text" [(ngModel)]="categoryForm.name" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Main Courses"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-dark mb-1">Description</label>
              <textarea [(ngModel)]="categoryForm.description" rows="3" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Brief description of this category"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button (click)="closeModal()" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button (click)="saveCategory()" [disabled]="!categoryForm.name" class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
              {{ editingCategory() ? 'Update' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminCategoriesComponent {
  categories = signal<Category[]>([
    { id: '1', name: 'Main Courses', description: 'Hearty main dishes and entrees', itemCount: 12, isActive: true },
    { id: '2', name: 'Appetizers', description: 'Starters and small plates', itemCount: 8, isActive: true },
    { id: '3', name: 'Desserts', description: 'Sweet treats and desserts', itemCount: 6, isActive: true },
    { id: '4', name: 'Beverages', description: 'Drinks and refreshments', itemCount: 15, isActive: true },
    { id: '5', name: 'Specials', description: 'Chef specials and seasonal items', itemCount: 4, isActive: false }
  ]);

  showAddModal = signal(false);
  editingCategory = signal<Category | null>(null);
  categoryForm = { name: '', description: '' };

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

  toggleCategory(cat: Category): void {
    this.categories.update(list => list.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c));
  }

  editCategory(cat: Category): void {
    this.editingCategory.set(cat);
    this.categoryForm = { name: cat.name, description: cat.description };
    this.showAddModal.set(true);
  }

  deleteCategory(cat: Category): void {
    if (confirm(`Delete "${cat.name}" category?`)) {
      this.categories.update(list => list.filter(c => c.id !== cat.id));
    }
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.editingCategory.set(null);
    this.categoryForm = { name: '', description: '' };
  }

  saveCategory(): void {
    if (!this.categoryForm.name) return;

    if (this.editingCategory()) {
      this.categories.update(list => list.map(c => 
        c.id === this.editingCategory()!.id 
          ? { ...c, name: this.categoryForm.name, description: this.categoryForm.description }
          : c
      ));
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name: this.categoryForm.name,
        description: this.categoryForm.description,
        itemCount: 0,
        isActive: true
      };
      this.categories.update(list => [...list, newCat]);
    }
    this.closeModal();
  }
}
