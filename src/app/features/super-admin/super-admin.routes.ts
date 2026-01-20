import { Routes } from '@angular/router';

export const SUPER_ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./super-admin-dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent) },
  { path: 'users', loadComponent: () => import('./super-admin-users/super-admin-users.component').then(m => m.SuperAdminUsersComponent) },
  { path: 'users/new', loadComponent: () => import('./super-admin-user-form/super-admin-user-form.component').then(m => m.SuperAdminUserFormComponent) },
  { path: 'users/:id/edit', loadComponent: () => import('./super-admin-user-form/super-admin-user-form.component').then(m => m.SuperAdminUserFormComponent) },
  { path: 'restaurants', loadComponent: () => import('./super-admin-restaurants/super-admin-restaurants.component').then(m => m.SuperAdminRestaurantsComponent) },
  { path: 'restaurants/new', loadComponent: () => import('./super-admin-restaurant-form/super-admin-restaurant-form.component').then(m => m.SuperAdminRestaurantFormComponent) },
  { path: 'restaurants/:id', loadComponent: () => import('./super-admin-restaurant-detail/super-admin-restaurant-detail.component').then(m => m.SuperAdminRestaurantDetailComponent) },
  { path: 'reports', loadComponent: () => import('./super-admin-reports/super-admin-reports.component').then(m => m.SuperAdminReportsComponent) }
];
