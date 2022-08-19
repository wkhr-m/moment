import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BookService } from './../../services/book.service';

export const SETTING_OUTPUT_TYPE = {
  RESYNC: 'RESYNC',
  DELETE: 'DELETE',
};
export type SettingOutputType =
  typeof SETTING_OUTPUT_TYPE[keyof typeof SETTING_OUTPUT_TYPE];

export type SettingOutput = Array<{ key: SettingOutputType; value?: string }>;

type Setting = {
  bookId: string;
  title: string;
  driveUrl: string;
};
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  form: FormControl;

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: Setting,
    private bookService: BookService
  ) {
    this.form = new FormControl<string>(this.data.driveUrl);
  }

  onClose(key?: SettingOutputType): void {
    this.dialogRef.close(key ? [{ key }] : undefined);
  }

  onBlur() {
    if (this.form.dirty) {
      const driveUrl = this.form.value || '';
      this.bookService
        .setDriveUrl(this.data.bookId, driveUrl)
        .subscribe(() => console.log('Success: save audio url'));
    }
  }

  onResync(): void {
    this.onClose(SETTING_OUTPUT_TYPE.RESYNC);
  }

  onDelete(): void {
    this.onClose(SETTING_OUTPUT_TYPE.DELETE);
  }
}
