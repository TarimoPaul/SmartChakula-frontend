import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Menu Items</h1>
                <p class="text-secondary text-sm mt-1">Manage your restaurant menu</p>
              </div>
              <a routerLink="/admin/menu/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Menu Item
              </a>
            </div>

            <!-- Category Filter -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-2">
                <button (click)="selectedCategory.set('')" 
                  class="px-4 py-2 rounded-lg font-medium transition-all"
                  [ngClass]="selectedCategory() === '' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'">
                  All Items
                </button>
                @for (cat of categories; track cat) {
                  <button (click)="selectedCategory.set(cat)"
                    class="px-4 py-2 rounded-lg font-medium transition-all"
                    [ngClass]="selectedCategory() === cat ? 'bg-primary text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'">
                    {{ cat }}
                  </button>
                }
              </div>
            </div>

            <!-- Menu Items Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (item of filteredItems(); track item.id) {
                <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div class="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    @if (item.imageUrl) {
                      <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover"/>
                    } @else {
                      <span class="text-5xl">🍽️</span>
                    }
                    <div class="absolute top-2 right-2">
                      <span class="px-2 py-1 rounded-full text-xs font-medium" 
                        [ngClass]="item.isAvailable ? 'bg-success text-white' : 'bg-gray-400 text-white'">
                        {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h3 class="font-semibold text-secondary-dark">{{ item.name }}</h3>
                        <span class="text-xs text-secondary bg-gray-100 px-2 py-0.5 rounded">{{ item.category }}</span>
                      </div>
                      <span class="text-lg font-bold text-primary">\${{ item.price.toFixed(2) }}</span>
                    </div>
                    <p class="text-sm text-secondary mb-4 line-clamp-2">{{ item.description }}</p>
                    <div class="flex gap-2">
                      <a [routerLink]="['/admin/menu', item.id, 'edit']" class="flex-1 px-3 py-2 text-center text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Edit</a>
                      <button (click)="toggleAvailability(item)" class="px-3 py-2 text-sm rounded-lg" 
                        [ngClass]="item.isAvailable ? 'text-warning border border-warning/20 hover:bg-warning/5' : 'text-success border border-success/20 hover:bg-success/5'">
                        {{ item.isAvailable ? 'Disable' : 'Enable' }}
                      </button>
                      <button (click)="deleteItem(item)" class="px-3 py-2 text-sm text-error border border-error/20 rounded-lg hover:bg-error/5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                  <div class="text-4xl mb-4">🍽️</div>
                  <p class="text-secondary mb-4">No menu items in this category</p>
                  <a routerLink="/admin/menu/new" class="inline-block px-4 py-2 bg-primary text-white rounded-lg">Add Menu Item</a>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminMenuComponent {
  categories = ['Main Courses', 'Appetizers', 'Desserts', 'Beverages', 'Specials'];
  selectedCategory = signal('');

  menuItems = signal<MenuItem[]>([
    { id: '1', name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herbs and lemon butter sauce', price: 28.99, category: 'Main Courses', imageUrl: '', isAvailable: true },
    { id: '2', name: 'Beef Tenderloin', description: 'Premium cut with red wine reduction and seasonal vegetables', price: 34.99, category: 'Main Courses', imageUrl: '', isAvailable: true },
    { id: '3', name: 'Caesar Salad', description: 'Crisp romaine with house-made dressing and parmesan', price: 12.99, category: 'Appetizers', imageUrl: '', isAvailable: true },
    { id: '4', name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes, basil, and garlic', price: 9.99, category: 'Appetizers', imageUrl: '', isAvailable: true },
    { id: '5', name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone', price: 10.99, category: 'Desserts', imageUrl: '', isAvailable: true },
    { id: '6', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 11.99, category: 'Desserts', imageUrl: '', isAvailable: false },
    { id: '7', name: 'House Red Wine', description: 'Glass of our signature house red', price: 8.99, category: 'Beverages', imageUrl: '', isAvailable: true },
    { id: '8', name: 'Fresh Lemonade', description: 'Freshly squeezed with mint', price: 4.99, category: 'Beverages', imageUrl: '', isAvailable: true }
  ]);

  filteredItems = signal<MenuItem[]>([]);

  constructor() {
    this.updateFilteredItems();
  }

  updateFilteredItems(): void {
    const cat = this.selectedCategory();
    if (cat) {
      this.filteredItems.set(this.menuItems().filter(i => i.category === cat));
    } else {
      this.filteredItems.set(this.menuItems());
    }
  }

  toggleAvailability(item: MenuItem): void {
    this.menuItems.update(list => list.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
    this.updateFilteredItems();
  }

  deleteItem(item: MenuItem): void {
    if (confirm(`Delete "${item.name}"?`)) {
      this.menuItems.update(list => list.filter(i => i.id !== item.id));
      this.updateFilteredItems();
    }
  }
}
