import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SettingsDropdownComponent } from '../settings-dropdown/settings-dropdown.component';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-super-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SettingsDropdownComponent],
  template: `
    <aside class="w-64 bg-secondary-dark text-white flex flex-col h-screen">
      <div class="p-6 border-b border-white/10">
        <h1 class="text-2xl font-display font-bold text-primary-light">RMRTS</h1>
        <p class="text-sm text-white/60 mt-1">Super Admin Panel</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/super-admin/dashboard" routerLinkActive="bg-white/10" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          <span>{{ t.t('nav.dashboard') }}</span>
        </a>
        <a routerLink="/super-admin/users" routerLinkActive="bg-white/10"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <span>{{ t.t('nav.users') }}</span>
        </a>
        <a routerLink="/super-admin/restaurants" routerLinkActive="bg-white/10"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <span>{{ t.t('nav.restaurants') }}</span>
        </a>
        <a routerLink="/super-admin/reports" routerLinkActive="bg-white/10"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span>{{ t.t('nav.reports') }}</span>
        </a>
      </nav>

      <div class="p-4 border-t border-white/10 space-y-3">
        <div class="flex items-center justify-between px-4">
          <span class="text-sm text-white/60">{{ t.t('common.settings') }}</span>
          <app-settings-dropdown />
        </div>
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white font-medium">👑</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ authService.currentUser()?.fullName }}</p>
            <p class="text-xs text-white/60">Super Admin</p>
          </div>
          <button (click)="authService.logout()" class="p-2 hover:bg-white/10 rounded-lg" [title]="t.t('common.logout')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SuperAdminSidebarComponent {
  authService = inject(AuthService);
  t = inject(TranslationService);
}
