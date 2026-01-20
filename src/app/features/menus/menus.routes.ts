import { Routes } from '@angular/router';

export const MENU_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./menu-list/menu-list.component').then(m => m.MenuListComponent) },
  { path: 'items/new', loadComponent: () => import('./menu-item-form/menu-item-form.component').then(m => m.MenuItemFormComponent) },
  { path: 'items/:id/edit', loadComponent: () => import('./menu-item-form/menu-item-form.component').then(m => m.MenuItemFormComponent) }
];
