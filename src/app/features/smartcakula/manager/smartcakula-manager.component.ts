import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-smartcakula-manager',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:24px; max-width: 1100px; margin: 0 auto;">
      <h1 style="margin:0 0 8px;">SmartCakula Manager</h1>
      <p style="margin:0 0 16px; opacity: 0.8;">Welcome, {{ auth.currentUser()?.fullName }} ({{ auth.currentUser()?.role }})</p>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
        <a routerLink="/smartcakula/admin" style="display:block; padding:16px; border:1px solid rgba(0,0,0,0.1); border-radius:12px; text-decoration:none; color:inherit;">
          <div style="font-weight:600;">Go to Admin</div>
          <div style="opacity:0.75; margin-top:6px;">Admin dashboard</div>
        </a>
        <a routerLink="/smartcakula/user" style="display:block; padding:16px; border:1px solid rgba(0,0,0,0.1); border-radius:12px; text-decoration:none; color:inherit;">
          <div style="font-weight:600;">Go to User</div>
          <div style="opacity:0.75; margin-top:6px;">User home</div>
        </a>
        <button (click)="auth.logout()" style="padding:16px; border:1px solid rgba(0,0,0,0.1); border-radius:12px; background:white; text-align:left; cursor:pointer;">
          <div style="font-weight:600;">Logout</div>
          <div style="opacity:0.75; margin-top:6px;">Clear session and return to login</div>
        </button>
      </div>
    </div>
  `
})
export class SmartCakulaManagerComponent {
  auth = inject(AuthService);
}
