import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface MenuItem { id: string; name: string; description: string; price: number; isAvailable: boolean; dietaryTags: string[]; }
interface Category { id: string; name: string; items: MenuItem[]; }
interface Menu { id: string; restaurantName: string; name: string; isActive: boolean; categories: Category[]; }

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Menu Management</h1>
                <p class="text-secondary text-sm mt-1">Manage restaurant menus and items</p>
              </div>
              <a routerLink="/menus/items/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Menu Item
              </a>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <select [(ngModel)]="selectedRestaurant" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Restaurants</option>
                  <option value="1">The Golden Fork</option>
                  <option value="2">Sakura Garden</option>
                </select>
                <input type="text" [(ngModel)]="searchQuery" placeholder="Search items..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
              </div>
            </div>

            @for (menu of filteredMenus(); track menu.id) {
              <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-4 bg-gradient-to-r from-primary/5 to-primary-light/5 border-b border-gray-100">
                  <div class="flex justify-between items-center">
                    <div>
                      <h2 class="text-lg font-semibold text-secondary-dark">{{ menu.name }}</h2>
                      <p class="text-secondary text-sm">{{ menu.restaurantName }}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium" [ngClass]="menu.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'">{{ menu.isActive ? 'Active' : 'Inactive' }}</span>
                  </div>
                </div>

                @for (category of menu.categories; track category.id) {
                  <div class="border-b border-gray-100 last:border-b-0">
                    <div class="p-4 bg-gray-50 flex justify-between items-center">
                      <h3 class="font-medium text-secondary-dark">{{ category.name }}</h3>
                      <span class="text-sm text-secondary">{{ category.items.length }} items</span>
                    </div>
                    <table class="w-full">
                      <thead class="bg-gray-50 text-left text-sm text-secondary">
                        <tr>
                          <th class="px-4 py-3 font-medium">Item</th>
                          <th class="px-4 py-3 font-medium">Price</th>
                          <th class="px-4 py-3 font-medium">Tags</th>
                          <th class="px-4 py-3 font-medium">Status</th>
                          <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        @for (item of category.items; track item.id) {
                          <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3">
                              <p class="font-medium text-secondary-dark">{{ item.name }}</p>
                              <p class="text-sm text-secondary truncate max-w-xs">{{ item.description }}</p>
                            </td>
                            <td class="px-4 py-3 font-medium text-secondary-dark">{{ item.price | currency }}</td>
                            <td class="px-4 py-3">
                              <div class="flex flex-wrap gap-1">
                                @for (tag of item.dietaryTags; track tag) {
                                  <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{{ tag }}</span>
                                }
                              </div>
                            </td>
                            <td class="px-4 py-3">
                              <button (click)="toggleAvailability(item)" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" [ngClass]="item.isAvailable ? 'bg-success' : 'bg-gray-300'">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" [ngClass]="item.isAvailable ? 'translate-x-6' : 'translate-x-1'"></span>
                              </button>
                            </td>
                            <td class="px-4 py-3 text-right">
                              <button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                              <button class="p-2 hover:bg-error/10 rounded-lg"><svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            } @empty {
              <div class="bg-white rounded-xl shadow-sm p-12 text-center"><p class="text-secondary">No menus found</p></div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class MenuListComponent {
  searchQuery = '';
  selectedRestaurant = '';

  menus = signal<Menu[]>([
    { id: '1', restaurantName: 'The Golden Fork', name: 'Main Menu', isActive: true, categories: [
      { id: 'c1', name: 'Appetizers', items: [
        { id: 'i1', name: 'Bruschetta', description: 'Toasted bread with tomatoes and basil', price: 8.99, isAvailable: true, dietaryTags: ['Vegetarian'] },
        { id: 'i2', name: 'Calamari Fritti', description: 'Crispy fried calamari with marinara', price: 12.99, isAvailable: true, dietaryTags: [] }
      ]},
      { id: 'c2', name: 'Main Courses', items: [
        { id: 'i3', name: 'Spaghetti Carbonara', description: 'Classic pasta with pancetta and egg', price: 18.99, isAvailable: true, dietaryTags: [] },
        { id: 'i4', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomatoes, basil', price: 16.99, isAvailable: false, dietaryTags: ['Vegetarian'] }
      ]}
    ]},
    { id: '2', restaurantName: 'Sakura Garden', name: 'Dinner Menu', isActive: true, categories: [
      { id: 'c3', name: 'Sushi Rolls', items: [
        { id: 'i5', name: 'California Roll', description: 'Crab, avocado, cucumber', price: 10.99, isAvailable: true, dietaryTags: ['Gluten-Free'] },
        { id: 'i6', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo', price: 12.99, isAvailable: true, dietaryTags: ['Spicy'] }
      ]}
    ]}
  ]);

  filteredMenus = signal<Menu[]>([]);

  constructor() { this.filteredMenus.set(this.menus()); }

  applyFilters(): void {
    let result = this.menus();
    if (this.selectedRestaurant) result = result.filter(m => m.id === this.selectedRestaurant);
    this.filteredMenus.set(result);
  }

  toggleAvailability(item: MenuItem): void { item.isAvailable = !item.isAvailable; }
}
