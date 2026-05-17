import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  AUTHORS,
  BOOK_AUTHORS,
  BOOK_CATEGORIES,
  BOOKS_RAW,
  CATEGORIES,
  PUBLISHERS,
  type BookRaw,
} from '@data';
import type {
  Book,
  BookAuthorRef,
  BookCategoryRef,
  BookDetail,
} from '@core/models';

@Injectable({ providedIn: 'root' })
export class BookService {
  getList(): Observable<Book[]> {
    const list: Book[] = BOOKS_RAW.map((raw) => this.toBookSummary(raw));
    return of(list);
  }

  getById(id: string): Observable<BookDetail | null> {
    const raw = BOOKS_RAW.find((b) => b.id === id);
    if (!raw) {
      return of(null);
    }
    return of(this.joinBookDetail(raw));
  }

  private toBookSummary(raw: BookRaw): Book {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      isbn: raw.isbn,
      publicationYear: raw.publicationYear,
    };
  }

  private joinBookDetail(raw: BookRaw): BookDetail {
    const publisher = PUBLISHERS.find((p) => p.id === raw.publisherId);

    const authors: BookAuthorRef[] = BOOK_AUTHORS
      .filter((link) => link.bookId === raw.id)
      .map((link) => AUTHORS.find((a) => a.id === link.authorId))
      .filter((a): a is NonNullable<typeof a> => a !== undefined)
      .map((a) => ({ id: a.id, firstName: a.firstName, lastName: a.lastName }));

    const categories: BookCategoryRef[] = BOOK_CATEGORIES
      .filter((link) => link.bookId === raw.id)
      .map((link) => CATEGORIES.find((c) => c.id === link.categoryId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined)
      .map((c) => ({ id: c.id, name: c.name }));

    return {
      ...this.toBookSummary(raw),
      publisherId: raw.publisherId,
      publisherName: publisher?.name ?? null,
      authors,
      categories,
    };
  }
}
