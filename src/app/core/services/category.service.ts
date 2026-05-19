import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

export interface CategoryListItem {
  readonly id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/categories`;

  getList(): Observable<CategoryListItem[]> {
    return this.http.get<CategoryListItem[]>(this.baseUrl);
  }
}
