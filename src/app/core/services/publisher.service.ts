import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

export interface PublisherListItem {
  readonly id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PublisherService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/publishers`;

  getList(): Observable<PublisherListItem[]> {
    return this.http.get<PublisherListItem[]>(this.baseUrl);
  }
}
