import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'customer/:id',
    loadComponent: () =>
      import('./components/customer-details/customer-details').then((m) => m.CustomerDetails),
    canActivate: [authGuard],
  },
  {
    path: 'transactions/:accountId',
    loadComponent: () =>
      import('./components/transactions/transactions').then((m) => m.Transactions),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
