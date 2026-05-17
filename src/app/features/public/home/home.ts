import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { BookService } from '@core/services';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly bookService = inject(BookService);

  protected readonly books = toSignal(this.bookService.getList());

  protected readonly sortedBooks = computed(() => {
    const list = this.books();
    if (!list) return [];
    return [...list].sort((a, b) => b.publicationYear - a.publicationYear);
  });

  protected readonly count = computed(() => this.books()?.length ?? 0);
}
