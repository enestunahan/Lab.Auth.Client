import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiHttpService } from '@core/http';

export interface AuthorListItem {
  readonly id: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly api = inject(ApiHttpService);

  getList(): Observable<AuthorListItem[]> {
    return this.api.get<AuthorListItem[]>('/api/authors');
  }
}
