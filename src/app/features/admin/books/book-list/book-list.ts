import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BookService, ConfirmService, NotificationService } from '@core/services';
import type { Book } from '@core/models';

@Component({
  selector: 'app-admin-book-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  private readonly bookService = inject(BookService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirm = inject(ConfirmService);
  private readonly notification = inject(NotificationService);

  protected readonly dataSource = new MatTableDataSource<Book>([]);

  protected readonly displayedColumns = ['title', 'publicationYear', 'isbn', 'actions'] as const;

  private readonly sort = viewChild<MatSort>(MatSort);
  private readonly paginator = viewChild<MatPaginator>(MatPaginator);

  constructor() {
    this.bookService
      .getList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((books) => {
        this.dataSource.data = books;
      });

    effect(() => {
      const sort = this.sort();
      const paginator = this.paginator();
      if (sort) this.dataSource.sort = sort;
      if (paginator) this.dataSource.paginator = paginator;
    });
  }

  protected applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  protected async onDelete(book: Book): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Kitabı sil',
      message: `"${book.title}" kalıcı olarak silinecek. Devam edilsin mi?`,
      confirmText: 'Sil',
      danger: true,
    });
    if (!confirmed) return;

    this.bookService
      .delete(book.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((b) => b.id !== book.id);
          this.notification.success(`"${book.title}" silindi.`);
        },
        error: () => this.notification.error('Silme sırasında bir hata oluştu.'),
      });
  }
}
