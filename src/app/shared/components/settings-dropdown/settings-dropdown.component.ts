import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { CurrencyService, Currency } from '../../../core/services/currency.service';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button (click)="isOpen.set(!isOpen())" 
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        [title]="translationService.t('common.settings')">
        <svg class="w-5 h-5 text-secondary dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>

      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <!-- Theme -->
          <div class="p-3 border-b border-gray-100 dark:border-gray-700">
            <p class="text-xs font-medium text-secondary dark:text-gray-400 uppercase mb-2">{{ translationService.t('settings.theme') }}</p>
            <div class="flex gap-2">
              <button (click)="themeService.setTheme('light')"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                [ngClass]="!themeService.isDark() ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                Light
              </button>
              <button (click)="themeService.setTheme('dark')"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                [ngClass]="themeService.isDark() ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                Dark
              </button>
            </div>
          </div>

          <!-- Language -->
          <div class="p-3 border-b border-gray-100 dark:border-gray-700">
            <p class="text-xs font-medium text-secondary dark:text-gray-400 uppercase mb-2">{{ translationService.t('settings.language') }}</p>
            <div class="space-y-1">
              @for (lang of translationService.getLanguages(); track lang.code) {
                <button (click)="translationService.setLanguage(lang.code)"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                  [ngClass]="translationService.currentLanguage() === lang.code ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-secondary-dark dark:text-gray-200'">
                  <span class="text-lg">{{ lang.flag }}</span>
                  <span>{{ lang.name }}</span>
                  @if (translationService.currentLanguage() === lang.code) {
                    <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Currency -->
          <div class="p-3">
            <p class="text-xs font-medium text-secondary dark:text-gray-400 uppercase mb-2">{{ translationService.t('settings.currency') }}</p>
            <div class="space-y-1 max-h-40 overflow-y-auto">
              @for (currency of currencyService.getCurrencies(); track currency.code) {
                <button (click)="currencyService.setCurrency(currency.code)"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                  [ngClass]="currencyService.currentCurrency().code === currency.code ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-secondary-dark dark:text-gray-200'">
                  <span class="w-8 font-medium">{{ currency.symbol }}</span>
                  <span>{{ currency.name }}</span>
                  @if (currencyService.currentCurrency().code === currency.code) {
                    <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Backdrop to close dropdown -->
    @if (isOpen()) {
      <div (click)="isOpen.set(false)" class="fixed inset-0 z-40"></div>
    }
  `
})
export class SettingsDropdownComponent {
  themeService = inject(ThemeService);
  translationService = inject(TranslationService);
  currencyService = inject(CurrencyService);

  isOpen = signal(false);
}
