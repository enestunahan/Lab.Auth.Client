import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import { BookService } from '@core/services';
import { HighlightOnHover } from '@shared';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink, HighlightOnHover],
  templateUrl: './book-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  protected readonly book = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')),
      switchMap((id) => (id ? this.bookService.getById(id) : of(null))),
    ),
  );
}
