/**
 * Backend tarafındaki `ErrorType` enum'unun TypeScript karşılığı.
 *
 * Backend bunu `JsonStringEnumConverter` ile string olarak gönderir
 * ('NotFound', 'Validation' vs.). Burada da string literal union olarak
 * tanımlandığı için her iki taraf tip güvenli şekilde aynı isimleri kullanır.
 */
export type ErrorType =
  | 'None'
  | 'Validation'
  | 'NotFound'
  | 'Conflict'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Unexpected';
