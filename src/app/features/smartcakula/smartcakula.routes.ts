import { Routes } from '@angular/router';

export const SMARTCAKULA_ROUTES: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'admin', loadComponent: () => import('./admin/smartcakula-admin.component').then(m => m.SmartCakulaAdminComponent) },
  { path: 'manager', loadComponent: () => import('./manager/smartcakula-manager.component').then(m => m.SmartCakulaManagerComponent) },
  { path: 'user', loadComponent: () => import('./user/smartcakula-user.component').then(m => m.SmartCakulaUserComponent) }
];
