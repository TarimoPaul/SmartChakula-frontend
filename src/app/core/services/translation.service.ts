import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'sw';

export interface Translations {
  [key: string]: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Common
    'app.name': 'RMRTS',
    'app.tagline': 'Restaurant Menu & Reservation System',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.logout': 'Logout',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
    
    // Navigation
    'nav.restaurants': 'Restaurants',
    'nav.myReservations': 'My Reservations',
    'nav.dashboard': 'Dashboard',
    'nav.users': 'Users',
    'nav.reports': 'Reports',
    'nav.menu': 'Menu',
    'nav.categories': 'Categories',
    'nav.reviews': 'Reviews',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    
    // Restaurant
    'restaurant.name': 'Restaurant Name',
    'restaurant.cuisine': 'Cuisine Type',
    'restaurant.region': 'Region',
    'restaurant.rating': 'Rating',
    'restaurant.reviews': 'Reviews',
    'restaurant.reserve': 'Reserve Table',
    'restaurant.viewMenu': 'View Menu',
    'restaurant.writeReview': 'Write Review',
    
    // Reservation
    'reservation.date': 'Date',
    'reservation.time': 'Time',
    'reservation.guests': 'Guests',
    'reservation.confirmed': 'Confirmed',
    'reservation.pending': 'Pending',
    'reservation.cancelled': 'Cancelled',
    
    // Menu
    'menu.items': 'Menu Items',
    'menu.price': 'Price',
    'menu.category': 'Category',
    'menu.available': 'Available',
    'menu.unavailable': 'Unavailable',
    
    // Settings
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.security': 'Security',
    'profile.preferences': 'Preferences',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.phone': 'Phone',
    'profile.changePassword': 'Change Password'
  },
  sw: {
    // Common
    'app.name': 'RMRTS',
    'app.tagline': 'Mfumo wa Menyu na Uhifadhi wa Mikahawa',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.edit': 'Hariri',
    'common.delete': 'Futa',
    'common.search': 'Tafuta',
    'common.filter': 'Chuja',
    'common.loading': 'Inapakia...',
    'common.logout': 'Ondoka',
    'common.profile': 'Wasifu',
    'common.settings': 'Mipangilio',
    
    // Navigation
    'nav.restaurants': 'Mikahawa',
    'nav.myReservations': 'Uhifadhi Wangu',
    'nav.dashboard': 'Dashibodi',
    'nav.users': 'Watumiaji',
    'nav.reports': 'Ripoti',
    'nav.menu': 'Menyu',
    'nav.categories': 'Kategoria',
    'nav.reviews': 'Maoni',
    
    // Auth
    'auth.login': 'Ingia',
    'auth.register': 'Jisajili',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.signIn': 'Ingia',
    'auth.signUp': 'Jisajili',
    'auth.forgotPassword': 'Umesahau Nenosiri?',
    'auth.noAccount': 'Huna akaunti?',
    'auth.hasAccount': 'Una akaunti tayari?',
    'auth.createAccount': 'Fungua Akaunti',
    
    // Restaurant
    'restaurant.name': 'Jina la Mkahawa',
    'restaurant.cuisine': 'Aina ya Chakula',
    'restaurant.region': 'Eneo',
    'restaurant.rating': 'Ukadiriaji',
    'restaurant.reviews': 'Maoni',
    'restaurant.reserve': 'Hifadhi Meza',
    'restaurant.viewMenu': 'Tazama Menyu',
    'restaurant.writeReview': 'Andika Maoni',
    
    // Reservation
    'reservation.date': 'Tarehe',
    'reservation.time': 'Wakati',
    'reservation.guests': 'Wageni',
    'reservation.confirmed': 'Imethibitishwa',
    'reservation.pending': 'Inasubiri',
    'reservation.cancelled': 'Imeghairiwa',
    
    // Menu
    'menu.items': 'Vitu vya Menyu',
    'menu.price': 'Bei',
    'menu.category': 'Kategoria',
    'menu.available': 'Inapatikana',
    'menu.unavailable': 'Haipatikani',
    
    // Settings
    'settings.theme': 'Mandhari',
    'settings.language': 'Lugha',
    'settings.currency': 'Sarafu',
    'settings.darkMode': 'Hali ya Giza',
    'settings.lightMode': 'Hali ya Mwanga',
    
    // Profile
    'profile.title': 'Wasifu Wangu',
    'profile.personalInfo': 'Taarifa Binafsi',
    'profile.security': 'Usalama',
    'profile.preferences': 'Mapendeleo',
    'profile.firstName': 'Jina la Kwanza',
    'profile.lastName': 'Jina la Mwisho',
    'profile.phone': 'Simu',
    'profile.changePassword': 'Badilisha Nenosiri'
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly LANG_KEY = 'rmrts_language';
  
  currentLanguage = signal<Language>('en');

  constructor() {
    this.loadStoredLanguage();
    
    effect(() => {
      localStorage.setItem(this.LANG_KEY, this.currentLanguage());
    });
  }

  private loadStoredLanguage(): void {
    const stored = localStorage.getItem(this.LANG_KEY) as Language;
    if (stored && (stored === 'en' || stored === 'sw')) {
      this.currentLanguage.set(stored);
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
  }

  t(key: string): string {
    const translations = TRANSLATIONS[this.currentLanguage()];
    return translations[key] || key;
  }

  getLanguages(): { code: Language; name: string; flag: string }[] {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
    ];
  }
}
