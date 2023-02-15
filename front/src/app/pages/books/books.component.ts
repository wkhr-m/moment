import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import type { Book } from '@m-types/books';
import { REGEXP_SPREADSHEET_URL } from '@utils/regexp';
import {
  DownloadBookComponent,
  DownloadBookComponentOutput,
} from '../../parts/download-book/download-book.component';
import { BookService } from '../../services/book.service';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = false;
  isInitLoaded: boolean = false;

  constructor(
    private bookService: BookService,
    private headerService: HeaderService,
    public dialog: Dialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerService.init();
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res) => {
        if (res?.length === 0) {
          this.router.navigateByUrl('/home');
        }
        this.books = res;
        this.isInitLoaded = true;
      },
      error: () => {
        this.router.navigateByUrl('/home');
      },
    });
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open<DownloadBookComponentOutput>(
      DownloadBookComponent,
      {
        backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
        data: { booksCount: this.books.length },
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
      this.isLoading = true;
      this.bookService.downloadBook(id, name).subscribe({
        next: (book) => {
          this._snackBar.open('読み込みに成功しました。', '', {
            duration: 5000,
          });
          this.loadBooks();
          this.isLoading = false;
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
          this._snackBar.open(msg, '', {
            duration: 5000,
            panelClass: ['warn-snackbar'],
          });
          this.isLoading = false;
        },
      });
    }
  }
}
