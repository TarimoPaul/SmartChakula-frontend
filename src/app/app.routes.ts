import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  
  // Super Admin Routes
  { 
    path: 'super-admin', 
    loadChildren: () => import('./features/super-admin/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES),
    canActivate: [authGuard]
  },

  // Restaurant Admin Routes
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },

  // Customer Routes
  { 
    path: 'customer', 
    loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
    canActivate: [authGuard]
  },

  // Legacy routes (redirect to new structure)
  { path: 'dashboard', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { 
    path: 'restaurants', 
    loadChildren: () => import('./features/restaurants/restaurants.routes').then(m => m.RESTAURANT_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'menus', 
    loadChildren: () => import('./features/menus/menus.routes').then(m => m.MENU_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'reservations', 
    loadChildren: () => import('./features/reservations/reservations.routes').then(m => m.RESERVATION_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'reviews', 
    loadChildren: () => import('./features/reviews/reviews.routes').then(m => m.REVIEW_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
