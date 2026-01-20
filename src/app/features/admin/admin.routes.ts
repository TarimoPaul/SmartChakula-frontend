import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'restaurants', loadComponent: () => import('./admin-restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent) },
  { path: 'restaurants/new', loadComponent: () => import('./admin-restaurant/admin-restaurant.component').then(m => m.AdminRestaurantComponent) },
  { path: 'restaurants/:id/edit', loadComponent: () => import('./admin-restaurant/admin-restaurant.component').then(m => m.AdminRestaurantComponent) },
  { path: 'categories', loadComponent: () => import('./admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
  { path: 'menu', loadComponent: () => import('./admin-menu/admin-menu.component').then(m => m.AdminMenuComponent) },
  { path: 'menu/new', loadComponent: () => import('./admin-menu-form/admin-menu-form.component').then(m => m.AdminMenuFormComponent) },
  { path: 'menu/:id/edit', loadComponent: () => import('./admin-menu-form/admin-menu-form.component').then(m => m.AdminMenuFormComponent) },
  { path: 'reservations', loadComponent: () => import('./admin-reservations/admin-reservations.component').then(m => m.AdminReservationsComponent) },
  { path: 'reviews', loadComponent: () => import('./admin-reviews/admin-reviews.component').then(m => m.AdminReviewsComponent) },
  { path: 'services', loadComponent: () => import('./admin-services/admin-services.component').then(m => m.AdminServicesComponent) },
  { path: 'services/new', loadComponent: () => import('./admin-service-form/admin-service-form.component').then(m => m.AdminServiceFormComponent) },
  { path: 'services/:id/edit', loadComponent: () => import('./admin-service-form/admin-service-form.component').then(m => m.AdminServiceFormComponent) },
  { path: 'regions', loadComponent: () => import('./admin-regions/admin-regions.component').then(m => m.AdminRegionsComponent) }
];
