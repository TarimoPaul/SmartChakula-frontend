import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CurrencyService } from '../../../core/services/currency.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-admin-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-service-form.component.html',
  styleUrl: './admin-service-form.component.css'
})
export class AdminServiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  currency = inject(CurrencyService);
  t = inject(TranslationService);

  isEditMode = signal(false);
  saving = signal(false);
  serviceId = '';

  categories = [
    { name: 'Catering', icon: '🍽️' },
    { name: 'Event Hosting', icon: '🎉' },
    { name: 'Delivery', icon: '🚗' },
    { name: 'Private Dining', icon: '🥂' },
    { name: 'Cooking Classes', icon: '👨‍🍳' },
    { name: 'Takeaway', icon: '📦' }
  ];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    priceType: ['fixed', Validators.required],
    duration: [''],
    minGuests: [null],
    maxGuests: [null],
    advanceBookingDays: [null],
    isActive: [true]
  });

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['id'];
    if (this.serviceId) {
      this.isEditMode.set(true);
      this.loadService();
    }
  }

  loadService(): void {
    // Mock data - in production, fetch from API
    const mockService = {
      name: 'Wedding Catering',
      category: 'Catering',
      description: 'Full-service catering for weddings including setup, service, and cleanup.',
      price: 50,
      priceType: 'per_person',
      duration: '',
      minGuests: 50,
      maxGuests: 300,
      advanceBookingDays: 30,
      isActive: true
    };
    this.form.patchValue(mockService);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);

    setTimeout(() => {
      console.log('Service saved:', this.form.value);
      this.saving.set(false);
      this.router.navigate(['/admin/services']);
    }, 1000);
  }
}
