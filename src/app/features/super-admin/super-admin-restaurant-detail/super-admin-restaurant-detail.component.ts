import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CurrencyService } from '../../../core/services/currency.service';

interface RestaurantService {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'per_person' | 'custom';
  duration?: string;
  isActive: boolean;
}

interface Review {
  id: string;
  customerName: string;
  priceFairness: boolean;
  serviceClarity: boolean;
  menuAccuracy: boolean;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-super-admin-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  templateUrl: './super-admin-restaurant-detail.component.html',
  styleUrl: './super-admin-restaurant-detail.component.css'
})
export class SuperAdminRestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  currency = inject(CurrencyService);

  restaurant = signal({
    id: '1',
    name: 'The Golden Fork',
    cuisineType: 'Italian',
    priceRange: '$$$',
    rating: 4.8,
    reviewCount: 124,
    reservationCount: 456,
    menuItemCount: 32,
    status: 'ACTIVE',
    address: '123 Main St',
    city: 'New York',
    region: 'Downtown',
    phone: '+1 555-1234',
    createdAt: '2024-01-10',
    owner: { id: '1', name: 'John Smith', email: 'john@restaurant.com', phone: '+1 555-5678', restaurantCount: 2 }
  });

  transparency = signal({ priceFairness: 92, serviceClarity: 85, menuAccuracy: 95 });

  reviews = signal<Review[]>([
    { id: '1', customerName: 'Alice Johnson', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Excellent experience! Everything was as advertised.', isVerified: true, createdAt: '2024-01-20' },
    { id: '2', customerName: 'Bob Smith', priceFairness: true, serviceClarity: false, menuAccuracy: true, comment: 'Great food but service fees were not clear.', isVerified: true, createdAt: '2024-01-19' },
    { id: '3', customerName: 'Carol Davis', priceFairness: false, serviceClarity: true, menuAccuracy: true, comment: 'Portions smaller than expected for the price.', isVerified: false, createdAt: '2024-01-18' },
    { id: '4', customerName: 'Dan Wilson', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Perfect!', isVerified: true, createdAt: '2024-01-17' }
  ]);

  services = signal<RestaurantService[]>([
    { id: '1', name: 'Wedding Catering', description: 'Full-service catering for weddings including setup, service, and cleanup.', category: 'Catering', price: 50, priceType: 'per_person', isActive: true },
    { id: '2', name: 'Corporate Event Package', description: 'Professional catering and event hosting for corporate meetings.', category: 'Event Hosting', price: 500, priceType: 'fixed', duration: '4 hours', isActive: true },
    { id: '3', name: 'Home Delivery', description: 'Fast and reliable food delivery to your doorstep.', category: 'Delivery', price: 5, priceType: 'fixed', isActive: true },
    { id: '4', name: 'Private Dining Room', description: 'Exclusive private dining experience for up to 20 guests.', category: 'Private Dining', price: 100, priceType: 'hourly', duration: '3 hours min', isActive: true },
    { id: '5', name: 'Italian Cooking Class', description: 'Learn authentic Italian cooking techniques from our head chef.', category: 'Cooking Classes', price: 75, priceType: 'per_person', duration: '2 hours', isActive: false }
  ]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Loading restaurant:', id);
  }

  toggleStatus(): void {
    const current = this.restaurant();
    const newStatus = current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.restaurant.set({ ...current, status: newStatus });
  }

  getServiceIcon(category: string): string {
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
      'fixed': 'Fixed',
      'hourly': '/hour',
      'per_person': '/person',
      'custom': 'Quote'
    };
    return labels[type] || type;
  }
}
