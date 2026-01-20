import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SettingsDropdownComponent } from '../settings-dropdown/settings-dropdown.component';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SettingsDropdownComponent],
  template: `
    <header class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a routerLink="/customer/restaurants" class="flex items-center gap-2">
          <h1 class="text-2xl font-display font-bold text-primary">RMRTS</h1>
        </a>
        
        <nav class="flex items-center gap-6">
          <a routerLink="/customer/restaurants" class="text-secondary dark:text-gray-300 hover:text-primary transition-colors font-medium">{{ t.t('nav.restaurants') }}</a>
          <a routerLink="/customer/my-reservations" class="text-secondary dark:text-gray-300 hover:text-primary transition-colors font-medium">{{ t.t('nav.myReservations') }}</a>
        </nav>

        <div class="flex items-center gap-3">
          <app-settings-dropdown />
          <a routerLink="/customer/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-primary font-medium text-sm">{{ getUserInitial() }}</span>
            </div>
            <span class="text-secondary-dark dark:text-gray-200 font-medium">{{ authService.currentUser()?.fullName }}</span>
          </a>
          <button (click)="logout()" class="text-secondary dark:text-gray-400 hover:text-error transition-colors" [title]="t.t('common.logout')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </header>
  `
})
export class CustomerHeaderComponent {
  authService = inject(AuthService);
  t = inject(TranslationService);

  getUserInitial(): string {
    return this.authService.currentUser()?.fullName?.charAt(0) || 'U';
  }

  logout(): void {
    this.authService.logout();
  }
}
