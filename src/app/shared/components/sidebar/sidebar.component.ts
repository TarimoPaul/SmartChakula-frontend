import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-xl font-display font-bold text-primary">RMRTS</h1>
        <p class="text-xs text-secondary">Admin Portal</p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        @for (item of menuItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="bg-primary/10 text-primary" 
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-gray-50 transition-colors">
            <span [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {{ authService.currentUser()?.fullName?.charAt(0) || 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-secondary-dark truncate">{{ authService.currentUser()?.fullName }}</p>
            <p class="text-xs text-secondary truncate">{{ authService.currentUser()?.role }}</p>
          </div>
        </div>
        <button (click)="authService.logout()" class="w-full px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors">
          Sign Out
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);
  
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
    { path: '/restaurants', label: 'Restaurants', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
    { path: '/menus', label: 'Menus', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { path: '/reservations', label: 'Reservations', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { path: '/reviews', label: 'Reviews', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>' }
  ];
}
