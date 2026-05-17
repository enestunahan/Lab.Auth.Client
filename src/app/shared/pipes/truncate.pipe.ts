import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength: number, suffix = '…'): string {
    if (value === null || value === undefined) return '';
    if (maxLength <= 0) return suffix;
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength).trimEnd() + suffix;
  }
}
