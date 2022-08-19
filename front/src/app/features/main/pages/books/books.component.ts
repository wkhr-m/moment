import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadBookComponent } from '../../parts/download-book/download-book.component';
import { BookService } from '../../services/book.service';
import type { Book } from '../../types/books';
import { REGEXP_SPREADSHEET_URL } from './../../../../utils/regexp';
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
    const dialogRef = this.dialog.open<string>(DownloadBookComponent, {
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
      data: {},
    });
    dialogRef.closed.subscribe((url?: string) => {
      if (url) {
        this.downloadBook(url);
      }
    });
  }

  private downloadBook(url: string) {
    const id = url.trim().match(REGEXP_SPREADSHEET_URL)?.[1];
    if (id) {
      this.isLoading = true;
      this.bookService.downloadBook(id).subscribe({
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
