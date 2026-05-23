import type { ErrorType } from './error-type';

/**
 * Backend tarafındaki `BaseResponse<T>` sınıfının TypeScript karşılığı.
 *
 * Tüm API endpoint'leri bu zarf yapısında cevap döner:
 *   - Başarılı: `{ isSuccess: true, data: T, errors: null, errorType: 'None' }`
 *   - Hatalı:   `{ isSuccess: false, data: null, errors: string[], errorType: ... }`
 *
 * Component'ler genelde bu tipi doğrudan görmez; `ApiHttpService` zarftan
 * `data` alanını çıkartıp ham veriyi döndürür. Hata durumları ise
 * `apiErrorInterceptor` tarafından yakalanır.
 */
export interface BaseResponse<T> {
  readonly isSuccess: boolean;
  readonly data: T | null;
  readonly errors: string[] | null;
  readonly errorType: ErrorType;
}
