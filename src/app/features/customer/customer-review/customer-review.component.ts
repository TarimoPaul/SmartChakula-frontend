import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
import { ReviewService } from '../../../core/services/review.service';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-customer-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-review.component.html',
  styleUrl: './customer-review.component.css'
})
export class CustomerReviewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reviewService = inject(ReviewService);
  private restaurantService = inject(RestaurantService);

  restaurantId = '';
  restaurantName = signal('Loading...');
  submitting = signal(false);
  showSuccess = signal(false);

  priceFairness = signal<boolean | null>(null);
  serviceClarity = signal<boolean | null>(null);
  menuAccuracy = signal<boolean | null>(null);

  form: FormGroup = this.fb.group({
    confirmationCode: [''],
    comment: ['', Validators.maxLength(500)]
  });

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id') || '';
    if (this.restaurantId) {
      this.restaurantService.getById(this.restaurantId).subscribe({
        next: (restaurant) => this.restaurantName.set(restaurant.name),
        error: () => this.restaurantName.set('Restaurant')
      });
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
    return this.priceFairness() !== null && 
           this.serviceClarity() !== null && 
           this.menuAccuracy() !== null;
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;
    this.submitting.set(true);

    this.reviewService.create({
      restaurantId: this.restaurantId,
      priceFairness: this.priceFairness()!,
      serviceClarity: this.serviceClarity()!,
      menuAccuracy: this.menuAccuracy()!,
      comment: this.form.get('comment')?.value
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showSuccess.set(true);
      },
      error: (err) => {
        console.error('Failed to submit review:', err);
        this.submitting.set(false);
        alert('Failed to submit review. Please try again.');
      }
    });
  }
}
