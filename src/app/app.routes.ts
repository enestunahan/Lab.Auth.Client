import { Routes } from '@angular/router';

import { PublicLayout } from '@features/public/layout/public-layout';
import { Home } from '@features/public/home/home';
import { BookDetail } from '@features/public/book-detail/book-detail';
import { NotFound } from '@features/public/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'books/:id', component: BookDetail },
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    component: NotFound,
  },
];
