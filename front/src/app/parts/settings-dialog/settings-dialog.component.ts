import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  sheetName = new FormControl('シート1', [Validators.required]);

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: Setting,
    private bookService: BookService,
    private _snackBar: MatSnackBar
  ) {
    this.form = new FormControl<string>(this.data.driveUrl);
  }

  onClose(key?: SettingOutputType, value?: string): void {
    this.dialogRef.close(key ? [{ key, value }] : undefined);
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
    if (!!this.sheetName.value?.trim()) {
      this.onClose(SETTING_OUTPUT_TYPE.RESYNC, this.sheetName.value);
    } else {
      this._snackBar.open('シート名を入力してください', '', {
        duration: 5000,
      });
    }
  }

  onDelete(): void {
    this.onClose(SETTING_OUTPUT_TYPE.DELETE);
  }
}
