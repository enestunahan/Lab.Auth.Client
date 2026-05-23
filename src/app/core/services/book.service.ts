import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiHttpService } from '@core/http';
import type { Book, BookDetail } from '@core/models';

export interface CreateBookPayload {
  title: string;
  description: string | null;
  isbn: string;
  publicationYear: number;
  publisherId: string;
}

export type UpdateBookPayload = CreateBookPayload;

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly api = inject(ApiHttpService);
  private readonly adminPath = '/api/admin/books';
  private readonly publicPath = '/api/books';

  getList(): Observable<Book[]> {
    return this.api.get<Book[]>(this.publicPath);
  }

  getById(id: string): Observable<BookDetail> {
    return this.api.get<BookDetail>(`${this.publicPath}/${id}`);
  }

  /** Backend `BaseResponse<Guid>` döner; `data` = yeni oluşturulan kitabın id'si. */
  create(payload: CreateBookPayload): Observable<string> {
    return this.api.post<string, CreateBookPayload>(this.adminPath, payload);
  }

  /** Backend `BaseResponse<Unit>` döner; data önemsiz, başarı/hata interceptor ile yönetilir. */
  update(id: string, payload: UpdateBookPayload): Observable<void> {
    return this.api.put<void, UpdateBookPayload>(`${this.adminPath}/${id}`, payload);
  }

  /** Backend `BaseResponse<Unit>` döner; data önemsiz, başarı/hata interceptor ile yönetilir. */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.adminPath}/${id}`);
  }
}
