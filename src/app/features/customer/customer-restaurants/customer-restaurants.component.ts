import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant, WorkingHours } from '../../../core/models';

interface RestaurantDisplay extends Restaurant {
  isOpen?: boolean;
}

@Component({
  selector: 'app-customer-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-restaurants.component.html',
  styleUrl: './customer-restaurants.component.css'
})
export class CustomerRestaurantsComponent implements OnInit {
  private restaurantService = inject(RestaurantService);

  searchQuery = '';
  regionFilter = '';
  cuisineFilter = '';
  priceFilter = '';
  sortBy = signal<'rating' | 'name'>('rating');
  loading = signal(false);

  restaurants = signal<RestaurantDisplay[]>([]);
  filteredRestaurants = signal<RestaurantDisplay[]>([]);

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.loading.set(true);
    this.restaurantService.getAll().subscribe({
      next: (response) => {
        const mapped = response.content.map(r => ({
          ...r,
          isOpen: this.checkIfOpen(r.workingHours)
        }));
        this.restaurants.set(mapped);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load restaurants:', err);
        this.loading.set(false);
      }
    });
  }

  checkIfOpen(workingHours?: WorkingHours[]): boolean {
    if (!workingHours || workingHours.length === 0) return true;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todayHours = workingHours.find(h => h.dayOfWeek === today);
    if (!todayHours || todayHours.isClosed) return false;
    return true;
  }

  applyFilters(): void {
    let result = this.restaurants();
    
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisineType.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    if (this.regionFilter) result = result.filter(r => r.region === this.regionFilter);
    if (this.cuisineFilter) result = result.filter(r => r.cuisineType === this.cuisineFilter);
    if (this.priceFilter) result = result.filter(r => r.priceRange === this.priceFilter);

    if (this.sortBy() === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredRestaurants.set(result);
  }

  getPriceLabel(price: string): string {
    const labels: Record<string, string> = { 'BUDGET': '$', 'MODERATE': '$$', 'PREMIUM': '$$$' };
    return labels[price] || '';
  }

  getTodayHours(restaurant: RestaurantDisplay): string {
    if (!restaurant.workingHours) return 'Hours not available';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todayHours = restaurant.workingHours.find(h => h.dayOfWeek === today);
    if (!todayHours || todayHours.isClosed) return 'Closed today';
    return `Today: ${todayHours.openTime} - ${todayHours.closeTime}`;
  }
}
