import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'create-hero',
    loadComponent: () =>
      import('./pages/hero-form-page/hero-form-page.component').then(
        (m) => m.HeroFormPageComponent
      ),
  },
  {
    path: 'edit-hero/:id',
    loadComponent: () =>
      import('./pages/hero-form-page/hero-form-page.component').then(
        (m) => m.HeroFormPageComponent
      ),
  },
  {
    path: 'detail-hero/:id',
    loadComponent: () =>
      import('./pages/detail-hero/detail-hero.component').then(
        (m) => m.DetailHeroComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
