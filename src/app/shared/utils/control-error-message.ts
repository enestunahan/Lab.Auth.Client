import type { AbstractControl } from '@angular/forms';

export function getControlErrorMessage(control: AbstractControl | null): string {
  if (!control?.errors) return '';

  const errors = control.errors;

  if (errors['required']) return 'Bu alan zorunludur.';
  if (errors['minlength']) {
    return `En az ${errors['minlength'].requiredLength} karakter olmalı.`;
  }
  if (errors['maxlength']) {
    return `En çok ${errors['maxlength'].requiredLength} karakter olabilir.`;
  }
  if (errors['min']) return `Değer en az ${errors['min'].min} olmalı.`;
  if (errors['max']) return `Değer en çok ${errors['max'].max} olabilir.`;
  if (errors['email']) return 'Geçerli bir e-posta adresi giriniz.';
  if (errors['pattern']) return 'Biçim geçersiz.';

  return 'Geçersiz değer.';
}
