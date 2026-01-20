import { Routes } from '@angular/router';

export const RESERVATION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./reservation-list/reservation-list.component').then(m => m.ReservationListComponent) },
  { path: 'new', loadComponent: () => import('./reservation-form/reservation-form.component').then(m => m.ReservationFormComponent) }
];
