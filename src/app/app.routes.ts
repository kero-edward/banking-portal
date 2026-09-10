import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'customer/:id',
    loadComponent: () =>
      import('./components/customer-details/customer-details').then((m) => m.CustomerDetails),
  },
  {
    path: 'transactions/:accountId',
    loadComponent: () =>
      import('./components/transactions/transactions').then((m) => m.Transactions),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
