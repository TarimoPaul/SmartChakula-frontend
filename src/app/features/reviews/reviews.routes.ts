import { Routes } from '@angular/router';

export const REVIEW_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./review-list/review-list.component').then(m => m.ReviewListComponent) },
  { path: 'new', loadComponent: () => import('./review-form/review-form.component').then(m => m.ReviewFormComponent) }
];
