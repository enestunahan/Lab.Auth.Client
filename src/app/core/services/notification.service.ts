import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type NotificationVariant = 'success' | 'error' | 'info';

export interface NotificationOptions {
  duration?: number;
  action?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly defaultDuration = 4000;

  success(message: string, opts?: NotificationOptions): void {
    this.show(message, 'success', opts);
  }

  error(message: string, opts?: NotificationOptions): void {
    this.show(message, 'error', opts);
  }

  info(message: string, opts?: NotificationOptions): void {
    this.show(message, 'info', opts);
  }

  private show(
    message: string,
    variant: NotificationVariant,
    opts?: NotificationOptions,
  ): void {
    const duration = opts?.duration ?? this.defaultDuration;
    this.snackBar.open(message, opts?.action ?? 'Kapat', {
      duration: duration === 0 ? undefined : duration,
      panelClass: [`notification-${variant}`],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
    });
  }
}
