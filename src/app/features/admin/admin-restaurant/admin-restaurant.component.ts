import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { GraphQLService, SmartCakulaRestaurant, SmartCakulaRestaurantInput } from '../../../core/services/graphql.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-restaurant.component.html',
  styleUrl: './admin-restaurant.component.css'
})
export class AdminRestaurantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private graphql = inject(GraphQLService);
  private auth = inject(AuthService);

  isEditMode = signal(false);
  saving = signal(false);
  restaurantId = '';

  logoDataUrl = signal<string | null>(null);

  weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  workingDays = signal<Record<string, boolean>>({
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false
  });

  workingHours = signal<Record<string, { open: string; close: string }>>({
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' }
  });

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    cuisineType: ['', Validators.required],
    priceRange: ['', Validators.required],
    description: [''],
    formattedAddress: ['', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required],
    openingTime: [''],
    closingTime: [''],
    latitude: [null],
    longitude: [null],
    phone: ['', Validators.required],
    website: ['']
  });

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    if (this.restaurantId) {
      this.isEditMode.set(true);
      this.loadRestaurant();
    }
  }

  loadRestaurant(): void {
    this.graphql.getSmartCakulaRestaurantByUid(this.restaurantId).subscribe({
      next: (r) => {
        this.applyRestaurantToForm(r);
      },
      error: () => {
        // keep form empty
      }
    });
  }

  private applyRestaurantToForm(r: SmartCakulaRestaurant): void {
    this.form.patchValue({
      name: r.name,
      cuisineType: r.type || '',
      priceRange: r.rank || '',
      description: r.description || '',
      formattedAddress: r.adress || '',
      region: r.region || '',
      city: r.city || '',
      openingTime: r.openingTime || '',
      closingTime: r.closingTime || '',
      phone: r.phoneNumber || '',
      website: r.websiteUrl || ''
    });

    if (r.image) {
      this.logoDataUrl.set(r.image);
    }

    if (r.days) {
      const selected = new Set(r.days.split(',').map(d => d.trim().toLowerCase()).filter(Boolean));
      this.workingDays.update(days => {
        const next: Record<string, boolean> = { ...days };
        for (const wd of this.weekDays) {
          next[wd.key] = selected.has(wd.key);
        }
        return next;
      });
    }

    if (r.openingTime || r.closingTime) {
      this.workingHours.update(hours => {
        const next: Record<string, { open: string; close: string }> = { ...hours };
        for (const wd of this.weekDays) {
          next[wd.key] = {
            open: r.openingTime || next[wd.key].open,
            close: r.closingTime || next[wd.key].close
          };
        }
        return next;
      });
    }
  }

  toggleDay(day: string): void {
    this.workingDays.update(days => ({ ...days, [day]: !days[day] }));
  }

  updateHours(day: string, type: 'open' | 'close', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.workingHours.update(hours => ({
      ...hours,
      [day]: { ...hours[day], [type]: value }
    }));
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.logoDataUrl.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.logoDataUrl.set(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const ownerUid = this.auth.currentUser()?.id;
    if (!ownerUid) {
      this.saving.set(false);
      return;
    }

    const selectedDays = this.weekDays.filter(d => this.workingDays()[d.key]);
    const firstDayKey = selectedDays[0]?.key;
    const openingTimeFromSchedule = firstDayKey ? this.workingHours()[firstDayKey].open : undefined;
    const closingTimeFromSchedule = firstDayKey ? this.workingHours()[firstDayKey].close : undefined;
    const openingTime = (this.form.value.openingTime || '').trim() || openingTimeFromSchedule;
    const closingTime = (this.form.value.closingTime || '').trim() || closingTimeFromSchedule;
    const days = selectedDays.map(d => d.key.toUpperCase()).join(',');

    const input: SmartCakulaRestaurantInput = {
      uid: this.isEditMode() ? this.restaurantId : undefined,
      name: this.form.value.name,
      description: this.form.value.description || undefined,
      phoneNumber: this.form.value.phone || undefined,
      region: this.form.value.region || undefined,
      city: this.form.value.city || undefined,
      isOpen: 'true',
      openingTime,
      closingTime,
      ownerUid,
      image: this.logoDataUrl() || undefined,
      type: this.form.value.cuisineType || undefined,
      rank: this.form.value.priceRange || undefined,
      adress: this.form.value.formattedAddress || undefined,
      websiteUrl: this.form.value.website || undefined,
      days: days || undefined
    };

    const request$ = this.isEditMode()
      ? this.graphql.updateSmartCakulaRestaurant(input)
      : this.graphql.createSmartCakulaRestaurant(input);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/restaurants']);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
