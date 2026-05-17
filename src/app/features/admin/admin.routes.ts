import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { BookList } from './books/book-list/book-list';
import { BookForm } from './books/book-form/book-form';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboard, pathMatch: 'full' },
      { path: 'books', component: BookList },
      { path: 'books/new', component: BookForm },
      { path: 'books/:id/edit', component: BookForm },
    ],
  },
];
