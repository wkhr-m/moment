import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from '../../services/book.service';

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
    private bookService: BookService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const id = this.form.value?.match(
      /^https?:\/{2,}docs.google.com\/spreadsheets[\/u\/0]*?\/d\/.*?(.*)\/.*?/
    )?.[1];
    if (!id) {
      this._snackBar.open('値が不正です', '', {
        duration: 5000,
      });
    } else {
      this.bookService.downloadBook(id).subscribe({
        next: (book) => {
          this._snackBar.open('成功しました。', '', {
            duration: 5000,
          });
          this.data = { needLoad: true };
          this.onClose();
        },
        error: (error) => {
          this._snackBar.open('失敗しました。', '', {
            duration: 5000,
          });
        },
      });
    }
  }
}
