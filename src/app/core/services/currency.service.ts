import { Injectable, signal, effect } from '@angular/core';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate from USD
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', rate: 2500 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 150 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 }
];

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly CURRENCY_KEY = 'rmrts_currency';
  
  currentCurrency = signal<Currency>(CURRENCIES[0]);

  constructor() {
    this.loadStoredCurrency();
    
    effect(() => {
      localStorage.setItem(this.CURRENCY_KEY, this.currentCurrency().code);
    });
  }

  private loadStoredCurrency(): void {
    const stored = localStorage.getItem(this.CURRENCY_KEY);
    if (stored) {
      const currency = CURRENCIES.find(c => c.code === stored);
      if (currency) {
        this.currentCurrency.set(currency);
      }
    }
  }

  setCurrency(code: string): void {
    const currency = CURRENCIES.find(c => c.code === code);
    if (currency) {
      this.currentCurrency.set(currency);
    }
  }

  getCurrencies(): Currency[] {
    return CURRENCIES;
  }

  format(amountInUSD: number): string {
    const currency = this.currentCurrency();
    const converted = amountInUSD * currency.rate;
    
    if (currency.code === 'USD' || currency.code === 'EUR' || currency.code === 'GBP') {
      return `${currency.symbol}${converted.toFixed(2)}`;
    }
    
    // For shillings, no decimals and add comma separators
    return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
  }

  convert(amountInUSD: number): number {
    return amountInUSD * this.currentCurrency().rate;
  }
}
