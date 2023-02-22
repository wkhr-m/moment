import { Clipboard } from '@angular/cdk/clipboard';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REGEXP_SPREADSHEET_URL } from '@utils/regexp';
import { environment } from './../../../environments/environment';

export type DownloadBookComponentOutput = {
  url: string;
  name: string;
};

type DownloadBookInput = {
  booksCount: number;
};

@Component({
  selector: 'app-download-book',
  templateUrl: './download-book.component.html',
  styleUrls: ['./download-book.component.scss'],
})
export class DownloadBookComponent {
  isCapacityOver: boolean = false;
  isNearCapacity: boolean = false;
  form = new FormGroup({
    url: new FormControl('', Validators.compose([Validators.required])),
    name: new FormControl('シート1', Validators.compose([Validators.required])),
  });

  constructor(
    public dialogRef: DialogRef,
    private _snackBar: MatSnackBar,
    private clipboard: Clipboard,
    @Inject(DIALOG_DATA) public data: DownloadBookInput
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (REGEXP_SPREADSHEET_URL.test(this.form.value.url?.trim() || '')) {
      this.dialogRef.close(this.form.value);
    } else {
      this._snackBar.open(
        '入力されたGoogle SheetsのURLかシート名が不正です。',
        '',
        {
          panelClass: ['warn-snackbar'],
          duration: 5000,
        }
      );
    }
  }

  onCopyAddress() {
    this.clipboard.copy(environment.service_account);
    this._snackBar.open('コピーしました。', '', {
      duration: 2000,
    });
  }
}
