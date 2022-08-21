import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  updatedAt: string;
};
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  sheetName = new FormControl('シート1', [Validators.required]);

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: Setting,
    private _snackBar: MatSnackBar
  ) {}

  onClose(key?: SettingOutputType, value?: string): void {
    this.dialogRef.close(key ? [{ key, value }] : undefined);
  }

  onResync(): void {
    if (!!this.sheetName.value?.trim()) {
      this.onClose(SETTING_OUTPUT_TYPE.RESYNC, this.sheetName.value);
    } else {
      this._snackBar.open('シート名を入力してください', '', {
        duration: 5000,
        panelClass: ['warn-snackbar'],
      });
    }
  }

  onDelete(): void {
    this.onClose(SETTING_OUTPUT_TYPE.DELETE);
  }
}
