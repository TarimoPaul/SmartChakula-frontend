import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerHeaderComponent } from '../../../shared/components/customer-header/customer-header.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CustomerHeaderComponent],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  editingProfile = signal(false);
  savingProfile = signal(false);
  showChangePassword = signal(false);
  showChangePhoto = signal(false);

  user = signal({
    id: '2',
    fullName: 'John Customer',
    email: 'customer@rmrts.com'
  });

  profile = signal({
    firstName: 'John',
    lastName: 'Customer',
    email: 'customer@rmrts.com',
    phone: '+1 555-1234'
  });

  stats = signal({
    reservations: 12,
    reviews: 8
  });

  preferences = signal({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });

  profileForm: FormGroup = this.fb.group({
    firstName: ['John', Validators.required],
    lastName: ['Customer', Validators.required],
    email: ['customer@rmrts.com', [Validators.required, Validators.email]],
    phone: ['+1 555-1234']
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword: ['', Validators.required]
  });

  constructor() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set({
        id: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email
      });
      const names = currentUser.fullName.split(' ');
      this.profile.set({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: currentUser.email,
        phone: '+1 555-1234'
      });
      this.profileForm.patchValue({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: currentUser.email
      });
    }
  }

  getInitials(): string {
    const names = this.user().fullName.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);

    setTimeout(() => {
      const { firstName, lastName, email, phone } = this.profileForm.value;
      this.profile.set({ firstName, lastName, email, phone });
      this.user.update(u => ({ ...u, fullName: `${firstName} ${lastName}`, email }));
      this.savingProfile.set(false);
      this.editingProfile.set(false);
    }, 500);
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.profile());
    this.editingProfile.set(false);
  }

  togglePreference(key: 'emailNotifications' | 'smsNotifications' | 'marketingEmails'): void {
    this.preferences.update(p => ({ ...p, [key]: !p[key] }));
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    console.log('Changing password...');
    this.showChangePassword.set(false);
    this.passwordForm.reset();
  }

  confirmDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
      this.authService.logout();
    }
  }
}
