import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import type { Book, BookDetail } from '@core/models';

export interface CreateBookPayload {
  title: string;
  description: string | null;
  isbn: string;
  publicationYear: number;
  publisherId: string;
}

export type UpdateBookPayload = CreateBookPayload;

interface CreateBookResponse {
  id: string;
}

interface CommandResultResponse {
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin/books`;
  private readonly publicUrl = `${environment.apiBaseUrl}/api/books`;

  getList(): Observable<Book[]> {
    return this.http.get<Book[]>(this.publicUrl);
  }

  getById(id: string): Observable<BookDetail | null> {
    return this.http.get<BookDetail | null>(`${this.publicUrl}/${id}`);
  }

  create(payload: CreateBookPayload): Observable<CreateBookResponse> {
    return this.http.post<CreateBookResponse>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateBookPayload): Observable<CommandResultResponse> {
    return this.http.put<CommandResultResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<CommandResultResponse> {
    return this.http.delete<CommandResultResponse>(`${this.baseUrl}/${id}`);
  }
}
