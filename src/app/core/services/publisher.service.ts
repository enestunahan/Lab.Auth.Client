import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiHttpService } from '@core/http';

export interface PublisherListItem {
  readonly id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PublisherService {
  private readonly api = inject(ApiHttpService);

  getList(): Observable<PublisherListItem[]> {
    return this.api.get<PublisherListItem[]>('/api/publishers');
  }
}
