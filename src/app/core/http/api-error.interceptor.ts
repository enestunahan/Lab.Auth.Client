import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import type { BaseResponse } from './base-response.model';

/**
 * HTTP hatalarını merkezi olarak yakalayan functional interceptor.
 *
 * Mantık:
 *  1. Backend `BaseResponse` formatında hata döndürmüşse (`errors: [...]`),
 *     o mesajı kullanıcıya toast olarak göster.
 *  2. Sunucuya hiç ulaşılamıyorsa (status 0) standart bir mesaj göster.
 *  3. Diğer durumlarda statusText veya generic fallback mesajı göster.
 *
 * Hata yine de zincirde error olarak ilerletilir (`throwError`); böylece
 * component özel davranış göstermek isterse `error` callback'inde
 * yakalayabilir. Ama mesajı tekrar göstermesine **gerek yoktur** —
 * interceptor zaten gösterdi.
 *
 * Bu yapı sayesinde:
 *  - Backend yeni bir hata tipi eklediğinde (ör. global exception handler ile),
 *    frontend tarafında hiçbir değişiklik gerekmez.
 *  - Component'ler artık hep aynı `NotificationService.error(...)` çağrısını
 *    tekrar tekrar yazmak zorunda değildir.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = extractErrorMessage(error);
      notification.error(message);
      return throwError(() => error);
    }),
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  // 1) Backend BaseResponse formatında hata döndürdüyse onun mesajını kullan
  const body = error.error as Partial<BaseResponse<unknown>> | null;
  if (body && Array.isArray(body.errors) && body.errors.length > 0) {
    return body.errors.join(' ');
  }

  // 2) Network/CORS hatası — sunucuya hiç ulaşılamamış
  if (error.status === 0) {
    return 'Sunucuya ulaşılamıyor. Lütfen bağlantını kontrol et.';
  }

  // 3) Fallback: statusText veya generic mesaj
  return error.statusText || 'Beklenmedik bir hata oluştu.';
}
