import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  dietaryTags: string[];
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

interface WorkingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

@Component({
  selector: 'app-customer-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-restaurant-detail.component.html',
  styleUrl: './customer-restaurant-detail.component.css'
})
export class CustomerRestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  currency = inject(CurrencyService);

  categories = ['Main Courses', 'Appetizers', 'Desserts', 'Beverages'];
  selectedCategory = signal('');

  restaurant = signal({
    id: '1',
    name: 'The Golden Fork',
    cuisineType: 'Italian',
    priceRange: '$$$',
    region: 'Downtown',
    city: 'New York',
    formattedAddress: '123 Main St, New York, NY 10001',
    rating: 4.8,
    reviewCount: 124,
    isOpen: true
  });

  menuItems = signal<MenuItem[]>([
    { id: '1', name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herbs and lemon butter sauce', price: 28.99, category: 'Main Courses', imageUrl: '', isAvailable: true, dietaryTags: ['Gluten-Free'] },
    { id: '2', name: 'Beef Tenderloin', description: 'Premium cut with red wine reduction', price: 34.99, category: 'Main Courses', imageUrl: '', isAvailable: true, dietaryTags: [] },
    { id: '3', name: 'Caesar Salad', description: 'Crisp romaine with house-made dressing', price: 12.99, category: 'Appetizers', imageUrl: '', isAvailable: true, dietaryTags: ['Vegetarian'] },
    { id: '4', name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes and basil', price: 9.99, category: 'Appetizers', imageUrl: '', isAvailable: true, dietaryTags: ['Vegan'] },
    { id: '5', name: 'Tiramisu', description: 'Classic Italian dessert with espresso', price: 10.99, category: 'Desserts', imageUrl: '', isAvailable: true, dietaryTags: ['Vegetarian'] },
    { id: '6', name: 'House Red Wine', description: 'Glass of our signature house red', price: 8.99, category: 'Beverages', imageUrl: '', isAvailable: true, dietaryTags: [] }
  ]);

  filteredMenuItems = signal<MenuItem[]>([]);

  reviews = signal<Review[]>([
    { id: '1', customerName: 'John S.', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Excellent experience!', isVerified: true, createdAt: '2024-01-20' },
    { id: '2', customerName: 'Sarah J.', priceFairness: true, serviceClarity: false, menuAccuracy: true, comment: 'Great food, fees unclear.', isVerified: true, createdAt: '2024-01-19' },
    { id: '3', customerName: 'Mike W.', priceFairness: true, serviceClarity: true, menuAccuracy: true, comment: 'Perfect!', isVerified: true, createdAt: '2024-01-18' }
  ]);

  workingHours = signal<WorkingHours[]>([
    { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', isClosed: true }
  ]);

  transparencyScores = signal({ priceFairness: 92, serviceClarity: 85, menuAccuracy: 95 });

  services = signal<RestaurantService[]>([
    { id: '1', name: 'Wedding Catering', description: 'Full-service catering for weddings including setup, service, and cleanup.', category: 'Catering', price: 50, priceType: 'per_person', isActive: true },
    { id: '2', name: 'Corporate Event Package', description: 'Professional catering and event hosting for corporate meetings.', category: 'Event Hosting', price: 500, priceType: 'fixed', duration: '4 hours', isActive: true },
    { id: '3', name: 'Home Delivery', description: 'Fast and reliable food delivery to your doorstep.', category: 'Delivery', price: 5, priceType: 'fixed', isActive: true },
    { id: '4', name: 'Private Dining Room', description: 'Exclusive private dining experience for up to 20 guests.', category: 'Private Dining', price: 100, priceType: 'hourly', duration: '3 hours min', isActive: true }
  ]);

  ngOnInit(): void {
    this.updateFilteredItems();
  }

  updateFilteredItems(): void {
    const cat = this.selectedCategory();
    if (cat) {
      this.filteredMenuItems.set(this.menuItems().filter(i => i.category === cat));
    } else {
      this.filteredMenuItems.set(this.menuItems());
    }
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
