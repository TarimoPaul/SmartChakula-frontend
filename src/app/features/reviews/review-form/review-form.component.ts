import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="flex items-center gap-4">
              <a routerLink="/reviews" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">Write a Review</h1>
                <p class="text-secondary text-sm">Share your dining experience</p>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Restaurant Selection -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Restaurant</h2>
                <select formControlName="restaurantId" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select a restaurant</option>
                  @for (r of restaurants; track r.id) {
                    <option [value]="r.id">{{ r.name }}</option>
                  }
                </select>
              </div>

              <!-- Transparency Ratings -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Transparency Ratings</h2>
                <p class="text-secondary text-sm mb-6">Rate your experience based on transparency factors</p>
                
                <div class="space-y-6">
                  <!-- Price Fairness -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 class="font-medium text-secondary-dark">Price Fairness</h3>
                      <p class="text-sm text-secondary">Were the prices as advertised on the menu?</p>
                    </div>
                    <div class="flex gap-3">
                      <button type="button" (click)="setRating('priceFairness', true)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="priceFairness() === true ? 'border-success bg-success/10' : 'border-gray-200 hover:border-success'">
                        <span class="text-2xl">👍</span>
                      </button>
                      <button type="button" (click)="setRating('priceFairness', false)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="priceFairness() === false ? 'border-error bg-error/10' : 'border-gray-200 hover:border-error'">
                        <span class="text-2xl">👎</span>
                      </button>
                    </div>
                  </div>

                  <!-- Service Clarity -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 class="font-medium text-secondary-dark">Service Clarity</h3>
                      <p class="text-sm text-secondary">Were service charges and fees clearly explained?</p>
                    </div>
                    <div class="flex gap-3">
                      <button type="button" (click)="setRating('serviceClarity', true)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="serviceClarity() === true ? 'border-success bg-success/10' : 'border-gray-200 hover:border-success'">
                        <span class="text-2xl">👍</span>
                      </button>
                      <button type="button" (click)="setRating('serviceClarity', false)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="serviceClarity() === false ? 'border-error bg-error/10' : 'border-gray-200 hover:border-error'">
                        <span class="text-2xl">👎</span>
                      </button>
                    </div>
                  </div>

                  <!-- Menu Accuracy -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 class="font-medium text-secondary-dark">Menu Accuracy</h3>
                      <p class="text-sm text-secondary">Did the food match the menu description?</p>
                    </div>
                    <div class="flex gap-3">
                      <button type="button" (click)="setRating('menuAccuracy', true)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="menuAccuracy() === true ? 'border-success bg-success/10' : 'border-gray-200 hover:border-success'">
                        <span class="text-2xl">👍</span>
                      </button>
                      <button type="button" (click)="setRating('menuAccuracy', false)" class="p-3 rounded-lg border-2 transition-all" [ngClass]="menuAccuracy() === false ? 'border-error bg-error/10' : 'border-gray-200 hover:border-error'">
                        <span class="text-2xl">👎</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reservation Verification -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Verify Your Visit</h2>
                <p class="text-secondary text-sm mb-4">Enter your reservation code to verify your review (optional)</p>
                <input type="text" formControlName="confirmationCode" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., RES-ABC12345"/>
                @if (form.get('confirmationCode')?.value) {
                  <p class="mt-2 text-sm text-success flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    Your review will be marked as verified
                  </p>
                }
              </div>

              <!-- Comment -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-lg font-semibold text-secondary-dark mb-4">Your Experience</h2>
                <textarea formControlName="comment" rows="5" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Share details about your dining experience..."></textarea>
                <p class="text-sm text-secondary mt-2">{{ form.get('comment')?.value?.length || 0 }}/500 characters</p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3">
                <a routerLink="/reviews" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</a>
                <button type="submit" [disabled]="!canSubmit() || submitting()" class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {{ submitting() ? 'Submitting...' : 'Submit Review' }}
                </button>
              </div>
            </form>

            <!-- Success Modal -->
            @if (showSuccess()) {
              <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                  <div class="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 class="text-xl font-bold text-secondary-dark mb-2">Thank You!</h3>
                  <p class="text-secondary mb-6">Your review has been submitted successfully and helps improve transparency for everyone.</p>
                  <a routerLink="/reviews" class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90">View All Reviews</a>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class ReviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = signal(false);
  showSuccess = signal(false);

  priceFairness = signal<boolean | null>(null);
  serviceClarity = signal<boolean | null>(null);
  menuAccuracy = signal<boolean | null>(null);

  restaurants = [
    { id: '1', name: 'The Golden Fork' },
    { id: '2', name: 'Sakura Garden' },
    { id: '3', name: 'Spice Route' },
    { id: '4', name: 'Le Petit Bistro' }
  ];

  form: FormGroup = this.fb.group({
    restaurantId: ['', Validators.required],
    confirmationCode: [''],
    comment: ['', Validators.maxLength(500)]
  });

  ngOnInit(): void {
    const restaurantId = this.route.snapshot.queryParamMap.get('restaurantId');
    if (restaurantId) {
      this.form.patchValue({ restaurantId });
    }
  }

  setRating(field: 'priceFairness' | 'serviceClarity' | 'menuAccuracy', value: boolean): void {
    if (field === 'priceFairness') {
      this.priceFairness.set(this.priceFairness() === value ? null : value);
    } else if (field === 'serviceClarity') {
      this.serviceClarity.set(this.serviceClarity() === value ? null : value);
    } else {
      this.menuAccuracy.set(this.menuAccuracy() === value ? null : value);
    }
  }

  canSubmit(): boolean {
    return this.form.valid && 
           this.priceFairness() !== null && 
           this.serviceClarity() !== null && 
           this.menuAccuracy() !== null;
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;
    this.submitting.set(true);

    const reviewData = {
      ...this.form.value,
      priceFairness: this.priceFairness(),
      serviceClarity: this.serviceClarity(),
      menuAccuracy: this.menuAccuracy(),
      isVerified: !!this.form.get('confirmationCode')?.value
    };

    console.log('Submitting review:', reviewData);

    setTimeout(() => {
      this.submitting.set(false);
      this.showSuccess.set(true);
    }, 1000);
  }
}
