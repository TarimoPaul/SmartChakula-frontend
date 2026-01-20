import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'restaurants', loadComponent: () => import('./customer-restaurants/customer-restaurants.component').then(m => m.CustomerRestaurantsComponent) },
  { path: 'restaurants/:id', loadComponent: () => import('./customer-restaurant-detail/customer-restaurant-detail.component').then(m => m.CustomerRestaurantDetailComponent) },
  { path: 'restaurants/:id/reserve', loadComponent: () => import('./customer-reservation/customer-reservation.component').then(m => m.CustomerReservationComponent) },
  { path: 'restaurants/:id/review', loadComponent: () => import('./customer-review/customer-review.component').then(m => m.CustomerReviewComponent) },
  { path: 'my-reservations', loadComponent: () => import('./customer-my-reservations/customer-my-reservations.component').then(m => m.CustomerMyReservationsComponent) },
  { path: 'profile', loadComponent: () => import('./customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent) }
];
