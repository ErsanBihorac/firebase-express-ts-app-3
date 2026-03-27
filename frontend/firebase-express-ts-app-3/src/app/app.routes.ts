import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  {
    path: 'create',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./post-create/post-create').then((m) => m.PostCreate);
    },
  },
  {
    path: 'auth',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./auth/auth').then((m) => m.Auth);
    },
  },
];
