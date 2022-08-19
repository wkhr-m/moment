import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteBookDialogComponent } from '../../parts/delete-book-dialog/delete-book-dialog.component';
import type { DetailBook } from '../../types/books';
import { BookService } from './../../services/book.service';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book?: DetailBook;
  bookId: string;
  isLoading: boolean = false;

  constructor(
    private headerService: HeaderService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: Dialog
  ) {
    this.bookId = this.route.snapshot.paramMap.get('bookId') || '';
  }

  ngOnInit(): void {
    this.bookService
      .getBookAndChapters(this.bookId)
      .subscribe((book: DetailBook) => {
        this.book = book;
        this.setHeader(book);
      });
  }

  onResync() {
    this.isLoading = true;
    this.bookService.downloadBook(this.bookId).subscribe({
      next: () => {
        this.isLoading = false;
        this._snackBar.open('再同期完了しました。', '', {
          duration: 5000,
        });
      },
      error: () => {
        this.isLoading = false;
        this._snackBar.open(
          '失敗しました。時間を置いてから再度お試しください。',
          '',
          {
            duration: 5000,
          }
        );
      },
    });
  }

  onDelete() {
    this.dialog.open(DeleteBookDialogComponent, {
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
      data: { title: this.book?.title, deleteBook: this.deleteBook },
    });
  }

  private deleteBook() {
    this.bookService.deleteBook(this.bookId).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  // headerにタイトルや色を設定する
  private setHeader(book: DetailBook): void {
    this.headerService.setBackURL('books');
    this.headerService.setTitle(book.title);
  }
}
