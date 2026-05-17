import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';

import {
  ConfirmDialog,
  type ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  async ask(options: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(
      ConfirmDialog,
      {
        data: options,
        autoFocus: 'dialog',
        restoreFocus: true,
        width: '420px',
        disableClose: false,
      },
    );

    const result = await lastValueFrom(ref.afterClosed());
    return result ?? false;
  }
}
