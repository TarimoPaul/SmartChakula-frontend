import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CurrencyService } from '../../../core/services/currency.service';
import { TranslationService } from '../../../core/services/translation.service';

interface RestaurantService {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'per_person' | 'custom';
  duration?: string;
  isActive: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent {
  currency = inject(CurrencyService);
  t = inject(TranslationService);

  searchQuery = '';
  categoryFilter = '';
  statusFilter = '';

  categories = ['Catering', 'Event Hosting', 'Delivery', 'Private Dining', 'Cooking Classes', 'Takeaway'];

  categoryInfo = [
    { name: 'Catering', icon: '🍽️' },
    { name: 'Event Hosting', icon: '🎉' },
    { name: 'Delivery', icon: '🚗' },
    { name: 'Private Dining', icon: '🥂' },
    { name: 'Cooking Classes', icon: '👨‍🍳' },
    { name: 'Takeaway', icon: '📦' }
  ];

  services = signal<RestaurantService[]>([
    { id: '1', name: 'Wedding Catering', description: 'Full-service catering for weddings including setup, service, and cleanup. Customizable menu options available.', category: 'Catering', price: 50, priceType: 'per_person', isActive: true, createdAt: new Date() },
    { id: '2', name: 'Corporate Event Package', description: 'Professional catering and event hosting for corporate meetings, conferences, and team events.', category: 'Event Hosting', price: 500, priceType: 'fixed', duration: '4 hours', isActive: true, createdAt: new Date() },
    { id: '3', name: 'Home Delivery', description: 'Fast and reliable food delivery to your doorstep within 10km radius.', category: 'Delivery', price: 5, priceType: 'fixed', isActive: true, createdAt: new Date() },
    { id: '4', name: 'Private Dining Room', description: 'Exclusive private dining experience for up to 20 guests with personalized menu and dedicated staff.', category: 'Private Dining', price: 100, priceType: 'hourly', duration: '3 hours min', isActive: true, createdAt: new Date() },
    { id: '5', name: 'Italian Cooking Class', description: 'Learn authentic Italian cooking techniques from our head chef. Includes all ingredients and recipes.', category: 'Cooking Classes', price: 75, priceType: 'per_person', duration: '2 hours', isActive: false, createdAt: new Date() },
    { id: '6', name: 'Party Takeaway Box', description: 'Pre-ordered party boxes for 10+ people. Perfect for home celebrations.', category: 'Takeaway', price: 25, priceType: 'per_person', isActive: true, createdAt: new Date() }
  ]);

  filteredServices = signal<RestaurantService[]>([]);

  constructor() {
    this.filteredServices.set(this.services());
  }

  filterServices(): void {
    let result = this.services();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
    }

    if (this.categoryFilter) {
      result = result.filter(s => s.category === this.categoryFilter);
    }

    if (this.statusFilter) {
      const isActive = this.statusFilter === 'active';
      result = result.filter(s => s.isActive === isActive);
    }

    this.filteredServices.set(result);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Catering': '🍽️',
      'Event Hosting': '🎉',
      'Delivery': '🚗',
      'Private Dining': '🥂',
      'Cooking Classes': '👨‍🍳',
      'Takeaway': '📦'
    };
    return icons[category] || '🛎️';
  }

  getPriceTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'fixed': 'Fixed Price',
      'hourly': 'Per Hour',
      'per_person': 'Per Person',
      'custom': 'Custom Quote'
    };
    return labels[type] || type;
  }

  getServiceCountByCategory(category: string): number {
    return this.services().filter(s => s.category === category).length;
  }

  toggleStatus(service: RestaurantService): void {
    this.services.update(list => list.map(s => s.id === service.id ? { ...s, isActive: !s.isActive } : s));
    this.filterServices();
  }

  deleteService(service: RestaurantService): void {
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      this.services.update(list => list.filter(s => s.id !== service.id));
      this.filterServices();
    }
  }
}
