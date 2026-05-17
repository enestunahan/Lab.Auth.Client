import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { BookService } from '@core/services';
import { AUTHORS, CATEGORIES, PUBLISHERS } from '@data';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly bookService = inject(BookService);

  private readonly books = toSignal(this.bookService.getList(), { initialValue: [] });

  protected readonly metrics = computed(() => [
    { label: 'Kitap', count: this.books().length, icon: 'menu_book' },
    { label: 'Yazar', count: AUTHORS.length, icon: 'person' },
    { label: 'Kategori', count: CATEGORIES.length, icon: 'sell' },
    { label: 'Yayıncı', count: PUBLISHERS.length, icon: 'storefront' },
  ]);
}
