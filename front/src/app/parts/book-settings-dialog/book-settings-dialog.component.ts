import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export const BOOK_SETTING_OUTPUT_TYPE = {
  RESYNC: 'RESYNC',
  DELETE: 'DELETE',
};
export type BookSettingOutputType =
  typeof BOOK_SETTING_OUTPUT_TYPE[keyof typeof BOOK_SETTING_OUTPUT_TYPE];

export type SettingOutput = Array<{
  key: BookSettingOutputType;
  value?: string;
}>;

type BookSettingInput = {
  bookId: string;
  title: string;
  updatedAt: string;
};
@Component({
  selector: 'app-book-settings-dialog',
  templateUrl: './book-settings-dialog.component.html',
  styleUrls: ['./book-settings-dialog.component.scss'],
})
export class BookSettingsDialogComponent {
  sheetName = new FormControl('シート1', [Validators.required]);

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: BookSettingInput,
    private _snackBar: MatSnackBar
  ) {}

  onClose(key?: BookSettingOutputType, value?: string): void {
    this.dialogRef.close(key ? [{ key, value }] : undefined);
  }

  onResync(): void {
    if (!!this.sheetName.value?.trim()) {
      this.onClose(BOOK_SETTING_OUTPUT_TYPE.RESYNC, this.sheetName.value);
    } else {
      this._snackBar.open('シート名を入力してください', '', {
        duration: 5000,
        panelClass: ['warn-snackbar'],
      });
    }
  }

  onDelete(): void {
    this.onClose(BOOK_SETTING_OUTPUT_TYPE.DELETE);
  }
}
