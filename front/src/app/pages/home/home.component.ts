import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { REGEXP_SPREADSHEET_URL } from '@utils/regexp';
import {
  DownloadBookComponent,
  DownloadBookComponentOutput,
} from './../../parts/download-book/download-book.component';
import { BookService } from './../../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  readingRef?: MatSnackBarRef<TextOnlySnackBar>;
  booksCount: number = 0;

  constructor(
    private bookService: BookService,
    private router: Router,
    public dialog: Dialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe((book) => {
      this.booksCount = book.length;
      if (book?.length > 0) {
        this.router.navigateByUrl('/books');
      }
    });
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open<DownloadBookComponentOutput>(
      DownloadBookComponent,
      {
        backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
        data: { booksCount: this.booksCount },
      }
    );
    dialogRef.closed.subscribe((result?: DownloadBookComponentOutput) => {
      if (result) {
        this.downloadBook(result.url, result.name);
      }
    });
  }

  private downloadBook(url: string, name: string) {
    const id = url.trim().match(REGEXP_SPREADSHEET_URL)?.[1];
    if (id) {
      this.readingRef = this._snackBar.open('読み込み中...');
      this.bookService.downloadBook(id, name).subscribe({
        next: () => {
          this._snackBar.open('読み込みに成功しました。', '', {
            duration: 5000,
          });
          this.router.navigateByUrl('/books');
        },
        error: (error: HttpErrorResponse) => {
          let msg = '読み込みに失敗しました。';
          if (error.status === 0) {
            msg =
              'インターネットに接続されていないため、読み込みに失敗しました。';
          } else if (
            error.status === HttpStatusCode.InternalServerError &&
            typeof error.error === 'string'
          ) {
            msg = error.error;
          }
          this.readingRef?.dismiss();
          this._snackBar.open(msg, '', {
            duration: 5000,
            panelClass: ['warn-snackbar'],
          });
        },
      });
    }
  }
}
