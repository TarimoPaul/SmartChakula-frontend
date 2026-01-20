import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuperAdminSidebarComponent } from '../../../shared/components/super-admin-sidebar/super-admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  restaurantCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-super-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SuperAdminSidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-background">
      <app-super-admin-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-display font-bold text-secondary-dark">User Management</h1>
                <p class="text-secondary text-sm mt-1">Manage all system users</p>
              </div>
              <a routerLink="/super-admin/users/new" class="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                Add User
              </a>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex flex-wrap gap-4">
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search by name or email..." class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                <select [(ngModel)]="roleFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
                <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <!-- Users Table -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 text-left text-sm text-secondary">
                  <tr>
                    <th class="px-4 py-3 font-medium">User</th>
                    <th class="px-4 py-3 font-medium">Role</th>
                    <th class="px-4 py-3 font-medium">Restaurants</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium">Joined</th>
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (user of filteredUsers(); track user.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full flex items-center justify-center"
                            [ngClass]="user.role === 'SUPER_ADMIN' ? 'bg-warning/10' : user.role === 'RESTAURANT_ADMIN' ? 'bg-primary/10' : 'bg-accent/10'">
                            <span class="font-medium" [ngClass]="user.role === 'SUPER_ADMIN' ? 'text-warning' : user.role === 'RESTAURANT_ADMIN' ? 'text-primary' : 'text-accent'">
                              {{ user.fullName.charAt(0) }}
                            </span>
                          </div>
                          <div>
                            <p class="font-medium text-secondary-dark">{{ user.fullName }}</p>
                            <p class="text-sm text-secondary">{{ user.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getRoleClass(user.role)">
                          {{ getRoleLabel(user.role) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        @if (user.role === 'RESTAURANT_ADMIN') {
                          <span class="font-medium">{{ user.restaurantCount }}</span>
                        } @else {
                          <span class="text-secondary">-</span>
                        }
                      </td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(user.status)">
                          {{ user.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-secondary">{{ user.createdAt }}</td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-1">
                          <a [routerLink]="['/super-admin/users', user.id, 'edit']" class="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                            <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </a>
                          @if (user.status === 'ACTIVE') {
                            <button (click)="suspendUser(user)" class="p-2 hover:bg-error/10 rounded-lg" title="Suspend">
                              <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                            </button>
                          } @else if (user.status === 'SUSPENDED') {
                            <button (click)="activateUser(user)" class="p-2 hover:bg-success/10 rounded-lg" title="Activate">
                              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </button>
                          }
                          @if (user.role !== 'SUPER_ADMIN') {
                            <button (click)="deleteUser(user)" class="p-2 hover:bg-error/10 rounded-lg" title="Delete">
                              <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="px-4 py-12 text-center text-secondary">No users found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SuperAdminUsersComponent {
  searchQuery = '';
  roleFilter = '';
  statusFilter = '';

  users = signal<User[]>([
    { id: '0', fullName: 'Super Admin', email: 'superadmin@rmrts.com', role: 'SUPER_ADMIN', status: 'ACTIVE', restaurantCount: 0, createdAt: '2024-01-01' },
    { id: '1', fullName: 'John Smith', email: 'john@restaurant.com', role: 'RESTAURANT_ADMIN', status: 'ACTIVE', restaurantCount: 2, createdAt: '2024-01-10' },
    { id: '2', fullName: 'Sarah Johnson', email: 'sarah@email.com', role: 'CUSTOMER', status: 'ACTIVE', restaurantCount: 0, createdAt: '2024-01-12' },
    { id: '3', fullName: 'Mike Wilson', email: 'mike@bistro.com', role: 'RESTAURANT_ADMIN', status: 'ACTIVE', restaurantCount: 1, createdAt: '2024-01-15' },
    { id: '4', fullName: 'Emily Brown', email: 'emily@email.com', role: 'CUSTOMER', status: 'INACTIVE', restaurantCount: 0, createdAt: '2024-01-18' },
    { id: '5', fullName: 'David Lee', email: 'david@cafe.com', role: 'RESTAURANT_ADMIN', status: 'SUSPENDED', restaurantCount: 3, createdAt: '2024-01-20' }
  ]);

  filteredUsers = signal<User[]>([]);

  constructor() {
    this.filteredUsers.set(this.users());
  }

  applyFilters(): void {
    let result = this.users();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (this.roleFilter) result = result.filter(u => u.role === this.roleFilter);
    if (this.statusFilter) result = result.filter(u => u.status === this.statusFilter);
    this.filteredUsers.set(result);
  }

  getRoleClass(role: string): string {
    const classes: Record<string, string> = {
      'SUPER_ADMIN': 'bg-warning/10 text-warning',
      'RESTAURANT_ADMIN': 'bg-primary/10 text-primary',
      'CUSTOMER': 'bg-accent/10 text-accent'
    };
    return classes[role] || '';
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'RESTAURANT_ADMIN': 'Restaurant Admin',
      'CUSTOMER': 'Customer'
    };
    return labels[role] || role;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'ACTIVE': 'bg-success/10 text-success',
      'INACTIVE': 'bg-gray-100 text-gray-500',
      'SUSPENDED': 'bg-error/10 text-error'
    };
    return classes[status] || '';
  }

  suspendUser(user: User): void {
    if (confirm(`Suspend user "${user.fullName}"?`)) {
      this.users.update(list => list.map(u => u.id === user.id ? { ...u, status: 'SUSPENDED' as const } : u));
      this.applyFilters();
    }
  }

  activateUser(user: User): void {
    this.users.update(list => list.map(u => u.id === user.id ? { ...u, status: 'ACTIVE' as const } : u));
    this.applyFilters();
  }

  deleteUser(user: User): void {
    if (confirm(`Delete user "${user.fullName}"? This action cannot be undone.`)) {
      this.users.update(list => list.filter(u => u.id !== user.id));
      this.applyFilters();
    }
  }
}
