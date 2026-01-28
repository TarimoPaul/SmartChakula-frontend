import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SettingsDropdownComponent } from '../settings-dropdown/settings-dropdown.component';
import { TranslationService } from '../../../core/services/translation.service';
import { GraphQLService, SmartCakulaRestaurant } from '../../../core/services/graphql.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SettingsDropdownComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private graphql = inject(GraphQLService);
  t = inject(TranslationService);

  private readonly selectedRestaurantStorageKey = 'selectedRestaurantUid';

  selectedRestaurantUid = '';
  restaurants = signal<SmartCakulaRestaurant[]>([]);

  ngOnInit(): void {
    this.selectedRestaurantUid = localStorage.getItem(this.selectedRestaurantStorageKey) || '';

    this.graphql.getSmartCakulaRestaurants().subscribe({
      next: (list) => {
        this.restaurants.set(list);

        // Initialize selection if missing or no longer valid
        const stillValid = !!list.find(r => r.uid === this.selectedRestaurantUid);
        if (!this.selectedRestaurantUid || !stillValid) {
          this.selectedRestaurantUid = list[0]?.uid || '';
          if (this.selectedRestaurantUid) {
            localStorage.setItem(this.selectedRestaurantStorageKey, this.selectedRestaurantUid);
          }
        }
      },
      error: () => {
        this.restaurants.set([]);
      }
    });
  }

  onRestaurantChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedRestaurantUid = select.value;
    localStorage.setItem(this.selectedRestaurantStorageKey, this.selectedRestaurantUid);
    console.log('Switched to restaurant:', this.selectedRestaurantUid);
  }

  logout(): void {
    this.authService.logout();
  }
}
