import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import {
  AuthorService,
  BookService,
  CategoryService,
  PublisherService,
} from '@core/services';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly bookService = inject(BookService);
  private readonly authorService = inject(AuthorService);
  private readonly categoryService = inject(CategoryService);
  private readonly publisherService = inject(PublisherService);

  private readonly books = toSignal(this.bookService.getList(), { initialValue: [] });
  private readonly authors = toSignal(this.authorService.getList(), { initialValue: [] });
  private readonly categories = toSignal(this.categoryService.getList(), { initialValue: [] });
  private readonly publishers = toSignal(this.publisherService.getList(), { initialValue: [] });

  protected readonly metrics = computed(() => [
    { label: 'Kitap', count: this.books().length, icon: 'menu_book' },
    { label: 'Yazar', count: this.authors().length, icon: 'person' },
    { label: 'Kategori', count: this.categories().length, icon: 'sell' },
    { label: 'Yayıncı', count: this.publishers().length, icon: 'storefront' },
  ]);
}
