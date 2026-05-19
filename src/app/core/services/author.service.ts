import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

export interface AuthorListItem {
  readonly id: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/authors`;

  getList(): Observable<AuthorListItem[]> {
    return this.http.get<AuthorListItem[]>(this.baseUrl);
  }
}
