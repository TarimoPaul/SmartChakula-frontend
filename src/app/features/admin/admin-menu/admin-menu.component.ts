import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaCategory, SmartCakulaMenuItem } from '../../../core/services/graphql.service';
import { PreviewImageComponent } from '../admin-restaurants/preview-image/preview-image.component';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryUid: string;
  categoryName: string;
  imageUrl: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent, HeaderComponent, PreviewImageComponent],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  private graphql = inject(GraphQLService);

  categories = signal<SmartCakulaCategory[]>([]);
  selectedCategoryUid = signal('');

  menuItems = signal<MenuItem[]>([]);

  filteredItems = signal<MenuItem[]>([]);

  toastVisible = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  private readonly selectedRestaurantStorageKey = 'selectedRestaurantUid';

  ngOnInit(): void {
    const stored = sessionStorage.getItem('adminMenuToast');
    if (stored) {
      sessionStorage.removeItem('adminMenuToast');
      try {
        const parsed = JSON.parse(stored) as { message: string; type: 'success' | 'error' };
        this.showToast(parsed.message, parsed.type);
      } catch {
        // ignore
      }
    }

    const restaurantUid = localStorage.getItem(this.selectedRestaurantStorageKey) || '';
    if (!restaurantUid) {
      this.menuItems.set([]);
      this.filteredItems.set([]);
      return;
    }

    this.graphql.getSmartCakulaCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.filter(c => c.restaurantUid === restaurantUid));
        // re-map category names if menu items already loaded
        this.menuItems.update(list => list.map(i => ({ ...i, categoryName: this.categoryNameFor(i.categoryUid) })));
        this.updateFilteredItems();
      },
      error: () => this.categories.set([])
    });

    this.graphql.getSmartCakulaMenuItemsByRestaurant(restaurantUid).subscribe({
      next: (items) => {
        const mapped = items.map(i => this.mapToUi(i));
        this.menuItems.set(mapped);
        this.updateFilteredItems();
      },
      error: () => {
        this.menuItems.set([]);
        this.updateFilteredItems();
      }
    });
  }

  selectCategory(uid: string): void {
    this.selectedCategoryUid.set(uid);
    this.updateFilteredItems();
  }

  updateFilteredItems(): void {
    const cat = this.selectedCategoryUid();
    if (cat) {
      this.filteredItems.set(this.menuItems().filter(i => i.categoryUid === cat));
    } else {
      this.filteredItems.set(this.menuItems());
    }
  }

  toggleAvailability(item: MenuItem): void {
    this.menuItems.update(list => list.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
    this.updateFilteredItems();
  }

  deleteItem(item: MenuItem): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.graphql.deleteSmartCakulaMenuItem(item.id).subscribe({
      next: () => {
        this.menuItems.update(list => list.filter(i => i.id !== item.id));
        this.updateFilteredItems();
        this.showToast('Menu item deleted successfully', 'success');
      },
      error: () => {
        this.showToast('Failed to delete menu item', 'error');
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

  private mapToUi(i: SmartCakulaMenuItem): MenuItem {
    return {
      id: i.uid,
      name: i.name,
      description: i.description || '',
      price: i.price,
      categoryUid: i.categoryUid,
      categoryName: this.categoryNameFor(i.categoryUid),
      imageUrl: i.image || '',
      isAvailable: !!i.isAvailable
    };
  }

  private categoryNameFor(categoryUid: string): string {
    const cat = this.categories().find(c => c.uid === categoryUid);
    return cat?.name || categoryUid;
  }
}
