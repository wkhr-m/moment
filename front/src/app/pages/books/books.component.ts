import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private bookService: BookService,
    private headerService: HeaderService,
    public dialog: Dialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.init();
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe((res) => {
      this.books = res;
    });
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open<DownloadBookComponentOutput>(
      DownloadBookComponent,
      {
        backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
        data: {},
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
        error: (error) => {
          this._snackBar.open('読み込みに失敗しました。', '', {
            duration: 5000,
          });
          this.isLoading = false;
        },
      });
    }
  }
}