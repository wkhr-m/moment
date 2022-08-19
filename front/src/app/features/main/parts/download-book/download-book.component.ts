import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REGEXP_SPREADSHEET_URL } from './../../../../utils/regexp';

export interface DialogData {
  needLoad: boolean;
}

@Component({
  selector: 'app-download-book',
  templateUrl: './download-book.component.html',
  styleUrls: ['./download-book.component.scss'],
})
export class DownloadBookComponent implements OnInit {
  form = new FormControl('', Validators.compose([Validators.required]));

  constructor(
    public dialogRef: DialogRef,
    @Optional() @Inject(DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.form.value) {
      this._snackBar.open('何も入力されていません。', '', {
        duration: 5000,
      });
    }
    if (REGEXP_SPREADSHEET_URL.test(this.form.value?.trim() || '')) {
      this.dialogRef.close(this.form.value);
      return;
    }
    this._snackBar.open('入力されたURLが不正です。', '', {
      duration: 5000,
    });
  }
}
