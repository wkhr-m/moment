import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

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
  sheetId: string;
  sheetName: string;
  title: string;
  updatedAt: string;
};
@Component({
  selector: 'app-book-settings-dialog',
  templateUrl: './book-settings-dialog.component.html',
  styleUrls: ['./book-settings-dialog.component.scss'],
})
export class BookSettingsDialogComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: BookSettingInput
  ) {}

  onClose(key?: BookSettingOutputType, value?: string): void {
    this.dialogRef.close(key ? [{ key, value }] : undefined);
  }

  onResync(): void {
    this.onClose(BOOK_SETTING_OUTPUT_TYPE.RESYNC, this.data.sheetName);
  }

  onDelete(): void {
    this.onClose(BOOK_SETTING_OUTPUT_TYPE.DELETE);
  }
}
