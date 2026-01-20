import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'rmrts_theme';
  
  currentTheme = signal<Theme>('light');

  constructor() {
    this.loadStoredTheme();
    
    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem(this.THEME_KEY, theme);
    });
  }

  private loadStoredTheme(): void {
    const stored = localStorage.getItem(this.THEME_KEY) as Theme;
    if (stored) {
      this.currentTheme.set(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.currentTheme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
