import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiHttpService } from '@core/http';

export interface CategoryListItem {
  readonly id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = inject(ApiHttpService);

  getList(): Observable<CategoryListItem[]> {
    return this.api.get<CategoryListItem[]>('/api/categories');
  }
}
