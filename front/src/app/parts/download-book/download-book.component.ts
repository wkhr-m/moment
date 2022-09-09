import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REGEXP_SPREADSHEET_URL } from '@utils/regexp';

export type DownloadBookComponentOutput = {
  url: string;
  name: string;
};

@Component({
  selector: 'app-download-book',
  templateUrl: './download-book.component.html',
  styleUrls: ['./download-book.component.scss'],
})
export class DownloadBookComponent implements OnInit {
  capacityMsg: string = '';
  isCapacityOver: boolean = true;
  isNearCapacity: boolean = false;
  form = new FormGroup({
    url: new FormControl('', Validators.compose([Validators.required])),
    name: new FormControl('シート1', Validators.compose([Validators.required])),
  });

  constructor(public dialogRef: DialogRef, private _snackBar: MatSnackBar) {}

  async ngOnInit() {
    if (!!navigator.storage.estimate) {
      const storage = await navigator.storage.estimate();
      const all = (storage.quota || 0) * 0.8;
      const usage = storage.usage || 0;
      const rate = Math.round((usage * 100) / all);
      this.capacityMsg = `現在${rate}%の容量が使用されています。`;
      if (rate > 99) {
        this.isCapacityOver = true;
      } else if (rate > 80) {
        this.isNearCapacity = true;
      }
    }
  }

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
}
