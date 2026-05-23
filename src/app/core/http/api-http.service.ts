import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '@env/environment';
import type { BaseResponse } from './base-response.model';

/**
 * Uygulama genelinde HTTP isteklerini standartlaştıran servis.
 *
 * Sorumluluk:
 *  - `environment.apiBaseUrl` ile mutlak URL oluşturur (servisler hep relative path verir).
 *  - Tüm istekleri `BaseResponse<T>` zarfında bekler.
 *  - Başarılı cevaplarda zarfı açar, sadece `data` alanını döner.
 *  - Hata cevaplarında (`HttpErrorResponse`) Observable error fırlatır;
 *    bu hatayı `apiErrorInterceptor` yakalar ve kullanıcıya bildirim gösterir.
 *
 * Component'ler/servisler bu servisi kullandığında `BaseResponse` detayını
 * görmek zorunda kalmaz — sadece "ham" domain modelleriyle çalışırlar.
 */
@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<TResponse>(path: string): Observable<TResponse> {
    return this.http
      .get<BaseResponse<TResponse>>(this.buildUrl(path))
      .pipe(map((response) => this.unwrap(response)));
  }

  post<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http
      .post<BaseResponse<TResponse>>(this.buildUrl(path), body)
      .pipe(map((response) => this.unwrap(response)));
  }

  put<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http
      .put<BaseResponse<TResponse>>(this.buildUrl(path), body)
      .pipe(map((response) => this.unwrap(response)));
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http
      .delete<BaseResponse<TResponse>>(this.buildUrl(path))
      .pipe(map((response) => this.unwrap(response)));
  }

  private buildUrl(path: string): string {
    const separator = path.startsWith('/') ? '' : '/';
    return `${this.baseUrl}${separator}${path}`;
  }

  /**
   * `BaseResponse<T>` zarfından `data` alanını çıkartır.
   *
   * Bu metoda gelen response her zaman `isSuccess: true` durumundadır;
   * çünkü hata durumları (4xx/5xx) Observable error olarak fırlatılır
   * ve buraya hiç ulaşmaz.
   *
   * Command endpoint'leri (Update/Delete gibi) backend tarafında `Unit`
   * döndüğü için JSON'da `data: {}` olarak gelir. Bu durumda `T = void`
   * çağrıldığı için tip uyuşmazlığı sorun çıkarmaz.
   */
  private unwrap<T>(response: BaseResponse<T>): T {
    return response.data as T;
  }
}
