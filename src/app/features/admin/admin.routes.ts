import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { BookList } from './books/book-list/book-list';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboard, pathMatch: 'full' },
      { path: 'books', component: BookList },
    ],
  },
];
