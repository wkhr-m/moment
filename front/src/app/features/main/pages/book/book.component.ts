import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SettingsDialogComponent,
  SETTING_OUTPUT_TYPE,
} from '../../parts/settings-dialog/settings-dialog.component';
import type { DetailBook } from '../../types/books';
import { SettingOutput } from './../../parts/settings-dialog/settings-dialog.component';
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
  driveUrl: string = '';
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
    this.updateDriveUrl();
  }

  private updateDriveUrl() {
    this.bookService
      .getDriveUrl(this.bookId)
      .subscribe((driveUrl) => (this.driveUrl = driveUrl));
  }

  openSettings() {
    const dialogRef = this.dialog.open<SettingOutput>(SettingsDialogComponent, {
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
      data: {
        title: this.book?.title,
        driveUrl: this.driveUrl,
        bookId: this.bookId,
      },
    });
    dialogRef.closed.subscribe((result?: SettingOutput) => {
      this.updateDriveUrl();
      if (result) {
        for (const setting of result) {
          switch (setting.key) {
            case SETTING_OUTPUT_TYPE.DELETE:
              this.deleteBook();
              break;
            case SETTING_OUTPUT_TYPE.RESYNC:
              this.resyncBook();
              break;
          }
        }
      }
    });
  }

  private resyncBook() {
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
